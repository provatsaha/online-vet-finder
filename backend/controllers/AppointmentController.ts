import Service from "../models/Service";
import Appointments from "../models/Appointments";
import Vet from "../models/Vet";
import User from "../models/User";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { aesDecrypt } from "../utils/aesUtils";
import { rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";

// Create a new appointment
export const createAppointment = async (req: any, res: any) => {
  const { vet_id, user_id, serviceId, notes, symptoms } = req.body;

  try {
    // Find the service to get its name and price
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Find user to get public key (encrypt with USER's public key)
    const userPublicKey = await getPublicKey(user_id);
    if (!userPublicKey)
      return res.status(500).json({ message: "No public key for user" });

    // Encrypt sensitive fields with USER's public key
    const encryptedNotes = notes ? rsaEncrypt(notes, userPublicKey) : undefined;
    const encryptedSymptoms = symptoms ? rsaEncrypt(symptoms, userPublicKey) : undefined;

    // Create a new appointment
    const appointment = new Appointments({
      vet_id,
      user_id,
      serviceId,
      name: service.name, // Set the name from the service
      price: service.cost, // Set the price from the service
      notes: encryptedNotes,
      symptoms: encryptedSymptoms,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

// Get all appointments for a user
export const getUserAppointments = async (req: any, res: any) => {
  const { user_id } = req.params;
  try {
    const appointments = await Appointments.find({ user_id })
      .populate("vet_id", "name")
      .populate("serviceId", "name cost");
    
    // Get user's private key for decryption
    const privateKey = await getPrivateKey(user_id);
    if (!privateKey) {
      return res.status(500).json({ message: "No private key for user" });
    }
    
    // Decrypt sensitive fields for user
    const decryptedAppointments = appointments.map((appt: any) => ({
      ...appt.toObject(),
      notes: appt.notes ? rsaDecrypt(appt.notes, privateKey) : undefined,
      symptoms: appt.symptoms ? rsaDecrypt(appt.symptoms, privateKey) : undefined
    }));
    
    res.status(200).json(decryptedAppointments);
  } catch (error) {
    console.error("[getVetAppointments] Error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const getVetAppointments = async (req: any, res: any) => {
  const { vet_id } = req.params;
  console.log(`[getVetAppointments] Fetching appointments for vet_id: ${vet_id}`);
  try {
    const appointments = await Appointments.find({ vet_id })
      .populate("serviceId", "name cost");
    
    console.log(`[getVetAppointments] Found ${appointments.length} appointments`);
    
    // Process appointments and decrypt user names
    const processedAppointments = [];
    
    for (const appointment of appointments) {
      try {
        // Fetch user data using the user_id ObjectId
        const user = await User.findById(appointment.user_id);
        if (!user) {
          processedAppointments.push({
            ...appointment.toObject(),
            user_id: { _id: appointment.user_id, name: "User not found" },
            notes: appointment.notes ? "[Private patient notes]" : "No notes provided",
            symptoms: appointment.symptoms ? "[Private patient symptoms]" : "No symptoms provided"
          });
          continue;
        }
        
        // Get user's private key to decrypt their name
        const userPrivateKey = await getPrivateKey(appointment.user_id.toString());
        let decryptedUserName = user.name;
        
        if (userPrivateKey && user.name) {
          try {
            // Try to decrypt the user name
            decryptedUserName = rsaDecrypt(user.name, userPrivateKey);
          } catch (decryptError) {
            console.log(`Could not decrypt user name for user ${appointment.user_id}, using original name`);
            decryptedUserName = user.name;
          }
        }
        
        processedAppointments.push({
          ...appointment.toObject(),
          user_id: {
            _id: user._id,
            name: decryptedUserName,
            email: user.email,
            address: user.address
          },
          notes: appointment.notes ? "[Private patient notes]" : "No notes provided",
          symptoms: appointment.symptoms ? "[Private patient symptoms]" : "No symptoms provided"
        });
        
      } catch (error) {
        console.error(`Error processing appointment ${appointment._id}:`, error);
        processedAppointments.push({
          ...appointment.toObject(),
          user_id: { _id: appointment.user_id, name: "Error loading user" },
          notes: appointment.notes ? "[Private patient notes]" : "No notes provided",
          symptoms: appointment.symptoms ? "[Private patient symptoms]" : "No symptoms provided"
        });
      }
    }
    
    res.status(200).json(processedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

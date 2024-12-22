import Service from "../models/Service";
import Appointments from "../models/Appointments";

// Create a new appointment
export const createAppointment = async (req: any, res: any) => {
  const { vet_id, user_id, serviceId } = req.body;

  try {
    // Find the service to get its name and price
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Create a new appointment
    const appointment = new Appointments({
      vet_id,
      user_id,
      serviceId,
      name: service.name, // Set the name from the service
      price: service.cost, // Set the price from the service
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
      .populate("vet_id", "name") // Populate vet details
      .populate("serviceId", "name cost"); // Populate service details

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

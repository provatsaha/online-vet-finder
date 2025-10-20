import { Request, Response } from "express";
import Vet from "../models/Vet";
import User from "../models/User";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { aesDecrypt } from "../utils/aesUtils";
import { rsaDecrypt } from "../utils/cryptoUtils";

// Emergency Appointment Endpoint
export const getEmergencyVet = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch user address from query params (support both query and body for flexibility)
    const address = req.query.address || req.body.address;
    if (!address) {
      res.status(400).json({ message: "User address is required" });
      return;
    }
    // Fetch all vets and decrypt their locations
    const vets = await Vet.find({}).populate("user");
    const matchingVets = [];
    const searchAddress = (address as string).trim().toLowerCase();
    console.log("Searching for address:", searchAddress);
    for (const vet of vets) {
      const user = vet.user;
      const privateKey = await getPrivateKey(user._id.toString());
      if (!privateKey) continue;
      let decryptedLocation = "";
      try {
        decryptedLocation = rsaDecrypt(vet.location, privateKey).trim().toLowerCase();
      } catch {
        continue;
      }
      console.log(`Vet: ${vet._id}, Decrypted Location: '${decryptedLocation}'`);
      if (decryptedLocation.includes(searchAddress)) {
        matchingVets.push({
          _id: vet._id,
          name: rsaDecrypt(vet.name, privateKey),
          location: decryptedLocation,
          specialization: vet.specialization,
          certifications: vet.certifications,
          createdAt: vet.createdAt,
          user: vet.user
        });
      }
    }
    console.log("Matching vets:", matchingVets.length);
    if (matchingVets.length > 0) {
      res.status(200).json({ message: "Vet found", vets: matchingVets });
    } else {
      res.status(404).json({
        message: "No vets available in your location",
        emergencyTips: [
          "Keep your pet calm and comfortable.",
          "Check for visible injuries or bleeding.",
          "Apply basic first aid if needed.",
        ],
        hotlines: {
          Dhaka: "+880 1234 567 890",
          Chittagong: "+880 2345 678 901",
          Khulna: "+880 3456 789 012",
        },
      });
    }
  } catch (error: any) {
    console.error("Error fetching emergency vet:", error);
    res.status(500).json({ message: "Failed to fetch emergency info", error });
  }
};

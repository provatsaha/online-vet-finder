import { Request, Response } from "express";
import Vet from "../models/Vet";
import User from "../models/User";

// Emergency Appointment Endpoint
export const getEmergencyVet = async (req: Request, res: Response) => {
  try {
    // Fetch user address from query params
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ message: "User address is required" });
    }

    // Find vets matching the user's address
    const vets = await Vet.find({ location: address });

    if (vets.length > 0) {
      // Return the first matched vet
      return res.status(200).json({ message: "Vet found", vets });
    } else {
      // No vets found, return fallback information
      return res.status(404).json({
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

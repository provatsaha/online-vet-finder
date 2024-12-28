import { Request, Response } from "express";
import Vet from "../models/Vet";

export const getVetById = async (req: Request, res: Response) => {
  try {
    const vet = await Vet.findById(req.params.id).populate("user");
    res.status(200).json(vet);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch vet", error });
  }
};

export const editVet = async (req: any, res: any) => {
  try {
    const vet = await Vet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    res.status(200).json(vet);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

export const newVet = async (req: Request, res: Response) => {
  try {
    const vet = await Vet.create(req.body);
    const newVet = await Vet.findById(vet._id).populate("user");
    res.status(201).json(newVet);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create vet", error });
  }
};

//for showing in emergency appointment
export const getVetsByLocation = async (req: Request, res: Response) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const vets = await Vet.find({ location });
    if (vets.length === 0) {
      return res
        .status(404)
        .json({ message: "No vets found at this location" });
    }

    res.status(200).json(vets);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch vets", error });
  }
};

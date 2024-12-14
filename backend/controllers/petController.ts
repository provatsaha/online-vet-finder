import { Request, Response } from "express";
import Pet from "../models/Pet";
import User from "../models/User";

export const getPetById = async (req: Request, res: Response) => {
	try {
		const pet = await Pet.findById(req.params.id).populate("owner");
		res.status(200).json(pet);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch pet", error });
	}
};

export const getPets = async (req: Request, res: Response) => {
	try {
		const owner = req.body.user_id;
		const pets = await Pet.find({ owner }).populate("owner");
		res.status(200).json(pets);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch pets", error });
	}
};

export const newPet = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data.owner) {
			return res.status(400).json({ message: "Owner is required" });
		}
		const owner = await User.findById(req.body.owner);
		if (!owner) {
			return res.status(404).json({ message: "Owner not found" });
		}
		const pet = await Pet.create(req.body);
		res.status(201).json(pet);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create pet", error });
	}
};

export const editPet = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data.owner) {
			return res.status(400).json({ message: "Owner is required" });
		}
		const owner = await User.findById(data.owner);
		if (!owner) {
			return res.status(404).json({ message: "Owner not found" });
		}
		if (!data._id) {
			return res.status(400).json({ message: "Pet ID is required" });
		}
		const pet = await Pet.findByIdAndUpdate(data._id, data, { new: true });
		res.status(201).json(pet);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to edit pet", error });
	}
};

export const deletePetById = async (req: any, res: any) => {
	try {
		const pet = await Pet.findById(req.params.id);
		if (!pet) {
			return res.status(404).json({ message: "Pet not found" });
		}
		await Pet.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Pet deleted successfully" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete pet", error });
	}
};

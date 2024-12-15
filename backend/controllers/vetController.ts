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

export const newVet = async (req: Request, res: Response) => {
	try {
		const vet = await Vet.create(req.body);
		const newVet = await Vet.findById(vet._id).populate("user");
		res.status(201).json(newVet);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create vet", error });
	}
};

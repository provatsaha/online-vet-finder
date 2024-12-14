import { Request, Response } from "express";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create vet", error });
	}
};

export const getProfileById = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.params.id);
		return res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch user", error });
	}
};

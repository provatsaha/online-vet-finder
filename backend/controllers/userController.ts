import { Request, Response } from "express";
import User from "../models/User";
import Vet from "../models/Vet";

export const signup = async (req: any, res: any) => {
	try {
		let body = req.body;
		body.type = "user";
		const user = await User.create(body);
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

export const login = async (req: any, res: any) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required." });
		}

		const user = await User.findOne({ email, password });
		if (!user) {
			return res
				.status(401)
				.json({ message: "Invalid email or password." });
		}

		const responsePayload: any = {
			message: "Login successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				type: user.type,
			},
		};

		const vet = await Vet.findOne({ user: user._id });

		if (vet) {
			responsePayload.user.vetId = vet._id;
		}

		res.status(200).json(responsePayload);
	} catch (error: any) {
		res.status(500).json({ message: "Login failed", error });
	}
};

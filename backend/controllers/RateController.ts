import { Request, Response } from "express";
import Vet from "../models/Vet";
import User from "../models/User";
import Rate from "../models/Rate";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { aesDecrypt } from "../utils/aesUtils";
import { rsaDecrypt, rsaEncrypt } from "../utils/cryptoUtils";

export const newRate = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const vet = await Vet.findById(data.vet);
		if (!vet) {
			return res.status(404).json({ message: "Vet not found" });
		}
		const user = await User.findById(data.user);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		// Store review as plain text (no encryption)
		const rate = await Rate.create({ ...data, review: data.review });
		res.status(201).json(rate);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create Rating", error });
	}
};

export const getRatings = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const ratings = await Rate.find({ vet: data.vet })
			.populate("user")
			.populate("vet");
		// Return review as plain text only
		const plainRatings = ratings.map((rating: any) => ({
			_id: rating._id,
			user: rating.user,
			vet: rating.vet,
			rating: rating.rating,
			review: rating.review,
			createdAt: rating.createdAt
		}));
		res.status(200).json(plainRatings);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch ratings", error });
	}
};

import { Request, Response } from "express";
import Article from "../models/Article";
import User from "../models/User";
import Comment from "../models/Comment";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { aesDecrypt } from "../utils/aesUtils";
import { rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";

export const newComment = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const user = await User.findById(data.user);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const article = await Article.findById(data.article);
		if (!article) {
			return res.status(404).json({ message: "Article not found" });
		}
		// Store comment content as plain text (no encryption)
		const comment = new Comment({ ...data, content: data.content });
		await comment.save();
		res.status(201).json({ message: "Comment created", comment });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create Comment", error });
	}
};

export const getComments = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const comments = await Comment.find({ article: data.article }).populate("user");
		// Return content as plain text
		const plainComments = comments.map((comment: any) => ({
			_id: comment._id,
			user: comment.user,
			article: comment.article,
			content: comment.content,
			createdAt: comment.createdAt
		}));
		res.status(200).json(plainComments);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch comments", error });
	}
};

export const deleteComments = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const comments = await Comment.findById(data.id);
		if (!comments) {
			return res.status(404).json({ message: "Comment not found" });
		}
		await Comment.findByIdAndDelete(data.id);
		res.status(200).json({ message: "Comment deleted" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete comments", error });
	}
};

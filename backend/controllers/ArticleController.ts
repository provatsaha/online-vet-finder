
import { Request, Response } from "express";
import Vet from "../models/Vet";
import Article from "../models/Article";
import User from "../models/User";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";

export const newArticle = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const vet = await Vet.findById(data.vet);
		if (!vet) {
			return res.status(404).json({ message: "Vet not found" });
		}
		// Get vet's user public key
		const user = await User.findById(vet.user);
		if (!user) {
			return res.status(404).json({ message: "User for vet not found" });
		}
		const encryptedPublicKey = user.publicKey;
		if (!encryptedPublicKey) {
			return res.status(500).json({ message: "No public key for vet's user" });
		}
		
		// Decrypt AES-encrypted public key before use
		const { aesDecrypt } = await import("../utils/aesUtils");
		const publicKey = aesDecrypt(encryptedPublicKey);
		
		// Encrypt title and content
		const encryptedTitle = rsaEncrypt(data.title, publicKey);
		const encryptedContent = rsaEncrypt(data.content, publicKey);
		const article = new Article({
			...data,
			title: encryptedTitle,
			content: encryptedContent
		});
		await article.save();
		res.status(201).json({ message: "Article created", article });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create Article", error });
	}
};


	export const getArticle = async (req: any, res: any) => {
		try {
			const data: any = req.body;
			if (!data) {
				return res.status(400).json({ message: "Body is required" });
			}
			const articles = await Article.find({ vet: data.vet }).populate("vet");
			// Decrypt title/content for each article using vet's private key (server-side for all users)
			const vet = await Vet.findById(data.vet);
			if (!vet) return res.status(404).json({ message: "Vet not found" });
			const user = await User.findById(vet.user);
			if (!user) return res.status(404).json({ message: "User for vet not found" });
			const privateKey = await getPrivateKey(user._id.toString());
			if (!privateKey) return res.status(500).json({ message: "No private key for vet's user" });
			const decryptedArticles = articles.map((article: any) => ({
				...article.toObject(),
				title: rsaDecrypt(article.title, privateKey),
				content: rsaDecrypt(article.content, privateKey)
			}));
			res.status(200).json(decryptedArticles);
		} catch (error: any) {
			res.status(500).json({ message: "Failed to fetch articles", error });
		}
	};


export const getArticleById = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const article = await Article.findById(data.id).populate("vet");
		if (!article) {
			return res.status(404).json({ message: "Article not found" });
		}
		// Decrypt title/content
		const vet = await Vet.findById(article.vet);
		if (!vet) return res.status(404).json({ message: "Vet not found" });
		const user = await User.findById(vet.user);
		if (!user) return res.status(404).json({ message: "User for vet not found" });
		const privateKey = await getPrivateKey(user._id.toString());
		if (!privateKey) return res.status(500).json({ message: "No private key for vet's user" });
		const decryptedArticle = {
			...article.toObject(),
			title: rsaDecrypt(article.title, privateKey),
			content: rsaDecrypt(article.content, privateKey)
		};
		res.status(200).json(decryptedArticle);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch article", error });
	}
};

export const deleteArticle = async (req: any, res: any) => {
	try {
		const data: any = req.body;
		if (!data) {
			return res.status(400).json({ message: "Body is required" });
		}
		const article = await Article.findById(data.id);
		if (!article) {
			return res.status(404).json({ message: "Article not found" });
		}
		await Article.findByIdAndDelete(data.id);
		res.status(200).json({ message: "Article deleted" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete article", error });
	}
};

import { Request, Response } from "express";
import Vet from "../models/Vet";
import Article from "../models/Article";

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
		const article = new Article(data);
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
		res.status(200).json(articles);
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
		res.status(200).json(article);
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

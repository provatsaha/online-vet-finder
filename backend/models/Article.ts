import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
	vet: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vet",
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Article =
	mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	article: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Article",
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

const Comment =
	mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;

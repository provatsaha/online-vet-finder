import mongoose from "mongoose";

const RateSchema = new mongoose.Schema({
	vet: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vet",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Rate = mongoose.models.Rate || mongoose.model("Rate", RateSchema);

export default Rate;

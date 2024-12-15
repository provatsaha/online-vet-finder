import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	cost: {
		type: Number,
		required: true,
	},
	vet: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vet",
		required: true,
	},
});

const Service =
	mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;

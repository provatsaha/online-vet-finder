import mongoose from "mongoose";

const VetSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	specialization: {
		type: String,
		required: true,
	},
	certifications: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Vet = mongoose.models.Vet || mongoose.model("Vet", VetSchema);

export default Vet;

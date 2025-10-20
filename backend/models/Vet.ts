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
		   required: false,
		   default: "General",
	   },
	certifications: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const Vet = mongoose.models.Vet || mongoose.model("Vet", VetSchema);

export default Vet;

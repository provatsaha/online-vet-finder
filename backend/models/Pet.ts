import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	picture: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	species: {
		type: String,
		required: true,
	},
	breed: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	sex: {
		type: String,
		required: true,
	},
	vaccinations_status: {
		type: String,
		required: true,
	},
	last_vaccination_date: {
		type: Date,
		required: true,
	},
	health_status: {
		type: String,
		required: true,
	},
});

const Pet = mongoose.models.Pet || mongoose.model("Pet", PetSchema);

export default Pet;

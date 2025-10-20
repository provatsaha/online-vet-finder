import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	}, // plaintext
	address: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	salt: {
		type: String,
		required: true,
	},
	nonce: {
		type: String,
		required: true,
	},
	   publicKey: {
		   type: String,
		   required: false,
	   }, // AES-encrypted PEM format, for encrypting data for this user
	createdAt: {
		type: Date,
		default: Date.now,
	},
	type: {
		type: String,
		required: true,
		enum: ["user", "vet"],
	},
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	address: {
        type: String,
        required: true,
    },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { getVetById, newVet } from "./controllers/vetController";
import { signup, getProfileById, login } from "./controllers/userController";
import {
	deleteService,
	editService,
	getServiceById,
	getServicesById,
	newService,
	searchServices,
} from "./controllers/serviceController";
import {
	deletePetById,
	editPet,
	getPetById,
	getPets,
	newPet,
} from "./controllers/petController";
import {
	sendOtp,
	verifyOtp,
	setNewPassword,
} from "./controllers/otpController";

const app: Application = express();

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
	const contentLength = req.headers["content-length"];
	console.log(
		`==> \x1b[33m${req.method} ${req.url}\x1b[0m` +
			" " +
			`\x1b[36mPayload Size: ${
				contentLength ? contentLength + " bytes" : "unknown"
			}\x1b[0m\n`
	);
	next();
});

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection failed:", error);
		process.exit(1);
	}
};

app.get("/api/vets/:id", getVetById);
app.post("/api/vets", newVet);
app.post("/api/users", signup);
app.post("/api/login", login);
app.get("/api/users/:id", getProfileById);
app.get("/api/pets/:id", getPetById);
app.post("/api/mypets", getPets);
app.post("/api/pets", newPet);
app.put("/api/pets", editPet);
app.delete("/api/pets/:id", deletePetById);

app.get("/api/services/:id", getServiceById);
app.post("/api/services", newService);
app.put("/api/services", editService);
app.delete("/api/services/:id", deleteService);
app.post("/api/myservices", getServicesById);
app.post("/api/services/search", searchServices);

app.post("/api/send-otp", sendOtp);
app.post("/api/verify-otp", verifyOtp);
app.post("/api/set-password", setNewPassword);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server running on port ${PORT}`);
});

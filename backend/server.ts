import express, { Application, Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// Importing appointment functions
import { createAppointment, getUserAppointments, getVetAppointments } from "./controllers/AppointmentController";

// Importing payment functions
import { createPayment, getUserPayments, updatePaymentStatus } from "./controllers/PaymentController";
import { addPaymentCard, getUserPaymentCards, updatePaymentCard, deletePaymentCard, setDefaultPaymentCard } from "./controllers/PaymentCardController";

import { getVetById, newVet, editVet, searchVets } from "./controllers/vetController";
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

import { newRate, getRatings } from "./controllers/RateController";
import {
  deleteArticle,
  getArticle,
  newArticle,
  getArticleById,
} from "./controllers/ArticleController";
import {
  deleteComments,
  getComments,
  newComment,
} from "./controllers/CommentController";
import { getEmergencyVet } from "./controllers/EmergencyController";
// Key management utilities are imported as needed

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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// API to create payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Define appointment routes
app.post("/api/appointments", createAppointment);
app.get("/api/appointments/:user_id", getUserAppointments);
app.get("/api/appointments/vet/:vet_id", getVetAppointments);

// Define payment routes
app.post("/api/payments", createPayment);
app.get("/api/payments/:user_id", getUserPayments);
app.put("/api/payments/:payment_id", updatePaymentStatus);

// Define payment card routes
app.post("/api/payment-cards", addPaymentCard);
app.get("/api/payment-cards/:user_id", getUserPaymentCards);
app.put("/api/payment-cards/:card_id", updatePaymentCard);
app.delete("/api/payment-cards/:card_id", deletePaymentCard);
app.put("/api/payment-cards/:card_id/default", setDefaultPaymentCard);

app.get("/api/vets/emergency", getEmergencyVet);
app.post("/api/vets/search", searchVets);
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
app.put("/api/vets/:id", editVet);

app.get("/api/services/:id", getServiceById);
app.post("/api/services", newService);
app.put("/api/services", editService);
app.delete("/api/services/:id", deleteService);
app.post("/api/myservices", getServicesById);
app.post("/api/services/search", searchServices);

app.post("/api/send-otp", sendOtp);
app.post("/api/verify-otp", verifyOtp);
app.post("/api/set-password", setNewPassword);

app.post("/api/rate", newRate);
app.post("/api/ratings", getRatings);

app.post("/api/articles", newArticle);
app.post("/api/articles/get", getArticle);
app.delete("/api/articles", deleteArticle);
app.post("/api/articles/getArticleById", getArticleById);

app.post("/api/comments", newComment);
app.post("/api/comments/get", getComments);
app.delete("/api/comments", deleteComments);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log("🔐 RSA Key Management System initialized - keys stored in MongoDB");
});

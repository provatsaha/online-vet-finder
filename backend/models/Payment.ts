import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "usd",
  },
  stripe_payment_intent_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "succeeded", "failed", "canceled"],
    default: "pending",
  },
  payment_method: {
    type: String, // Encrypted card last 4 digits
  },
  billing_name: {
    type: String, // Encrypted billing name
  },
  billing_email: {
    type: String, // Encrypted billing email
  },
  billing_address: {
    type: String, // Encrypted billing address
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;


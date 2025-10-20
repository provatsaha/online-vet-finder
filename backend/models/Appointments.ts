import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  vet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vet",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true }, // Name of the service
  price: { type: Number, required: true }, // Price of the service
  notes: { type: String }, // Sensitive, encrypt
  symptoms: { type: String }, // Sensitive, encrypt
});

// Create the Appointment model
const Appointments = mongoose.model("Appointment", appointmentSchema);

export default Appointments;

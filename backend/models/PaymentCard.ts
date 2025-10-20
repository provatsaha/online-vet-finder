import mongoose from "mongoose";

const PaymentCardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  card_holder_name: {
    type: String, // Encrypted with user's public key
    required: true,
  },
  card_number: {
    type: String, // Encrypted with user's public key (last 4 digits only)
    required: true,
  },
  expiry_month: {
    type: String, // Encrypted with user's public key
    required: true,
  },
  expiry_year: {
    type: String, // Encrypted with user's public key
    required: true,
  },
  cvv: {
    type: String, // Encrypted with user's public key
    required: true,
  },
  billing_address: {
    street: {
      type: String, // Encrypted with user's public key
      required: true,
    },
    city: {
      type: String, // Encrypted with user's public key
      required: true,
    },
    state: {
      type: String, // Encrypted with user's public key
      required: true,
    },
    zip_code: {
      type: String, // Encrypted with user's public key
      required: true,
    },
    country: {
      type: String, // Encrypted with user's public key
      default: "US",
    },
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  stripe_payment_method_id: {
    type: String, // Stripe payment method ID for future payments
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at field before saving
PaymentCardSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const PaymentCard = mongoose.models.PaymentCard || mongoose.model("PaymentCard", PaymentCardSchema);

export default PaymentCard;

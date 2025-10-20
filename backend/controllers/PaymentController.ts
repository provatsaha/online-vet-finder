import Payment from "../models/Payment";
import Appointments from "../models/Appointments";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";
import { aesDecrypt } from "../utils/aesUtils";

// Create a new payment record
export const createPayment = async (req: any, res: any) => {
  const { 
    user_id, 
    appointment_id, 
    amount, 
    stripe_payment_intent_id, 
    status,
    payment_method,
    billing_name,
    billing_email,
    billing_address 
  } = req.body;

  try {
    // Get user's public key for encryption
    const publicKey = await getPublicKey(user_id);
    if (!publicKey) {
      return res.status(500).json({ message: "No public key for user" });
    }

    // Encrypt sensitive billing information
    const encryptedPaymentMethod = payment_method ? rsaEncrypt(payment_method, publicKey) : undefined;
    const encryptedBillingName = billing_name ? rsaEncrypt(billing_name, publicKey) : undefined;
    const encryptedBillingEmail = billing_email ? rsaEncrypt(billing_email, publicKey) : undefined;
    const encryptedBillingAddress = billing_address ? rsaEncrypt(billing_address, publicKey) : undefined;

    // Create payment record
    const payment = new Payment({
      user_id,
      appointment_id,
      amount,
      stripe_payment_intent_id,
      status,
      payment_method: encryptedPaymentMethod,
      billing_name: encryptedBillingName,
      billing_email: encryptedBillingEmail,
      billing_address: encryptedBillingAddress,
    });

    await payment.save();
    
    res.status(201).json({ 
      message: "Payment record created successfully", 
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create payment record" });
  }
};

// Get payment history for a user
export const getUserPayments = async (req: any, res: any) => {
  const { user_id } = req.params;

  try {
    const payments = await Payment.find({ user_id })
      .populate("appointment_id", "name price createdAt")
      .sort({ createdAt: -1 });

    // Get user's private key for decryption
    const privateKey = await getPrivateKey(user_id);
    if (!privateKey) {
      return res.status(500).json({ message: "No private key for user" });
    }

    // Decrypt sensitive information
    const decryptedPayments = payments.map((payment: any) => ({
      _id: payment._id,
      appointment_id: payment.appointment_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      stripe_payment_intent_id: payment.stripe_payment_intent_id,
      payment_method: payment.payment_method ? rsaDecrypt(payment.payment_method, privateKey) : undefined,
      billing_name: payment.billing_name ? rsaDecrypt(payment.billing_name, privateKey) : undefined,
      billing_email: payment.billing_email ? rsaDecrypt(payment.billing_email, privateKey) : undefined,
      billing_address: payment.billing_address ? rsaDecrypt(payment.billing_address, privateKey) : undefined,
      createdAt: payment.createdAt,
    }));

    res.status(200).json(decryptedPayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

// Update payment status
export const updatePaymentStatus = async (req: any, res: any) => {
  const { payment_id } = req.params;
  const { status } = req.body;

  try {
    const payment = await Payment.findByIdAndUpdate(
      payment_id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ 
      message: "Payment status updated successfully", 
      payment: {
        id: payment._id,
        status: payment.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};


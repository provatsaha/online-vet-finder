import PaymentCard from "../models/PaymentCard";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";
import { aesDecrypt } from "../utils/aesUtils";

// Add a new payment card
export const addPaymentCard = async (req: any, res: any) => {
  const { 
    user_id,
    card_holder_name,
    card_number,
    expiry_month,
    expiry_year,
    cvv,
    billing_address,
    is_default
  } = req.body;

  console.log("Adding payment card for user:", user_id);

  try {
    // Validate required fields
    if (!user_id || !card_holder_name || !card_number || !expiry_month || !expiry_year || !cvv || !billing_address) {
      console.error("Missing required card fields");
      return res.status(400).json({ message: "All card fields are required" });
    }

    // Get user's public key for encryption (decrypt AES first)
    console.log("Fetching and decrypting public key for user:", user_id);
    const publicKey = await getPublicKey(user_id);
    if (!publicKey) {
      console.error("No public key found for user:", user_id);
      return res.status(500).json({ message: "No public key for user" });
    }

    console.log("Public key retrieved and decrypted successfully for user:", user_id);

    // If this is set as default, unset other default cards
    if (is_default) {
      await PaymentCard.updateMany(
        { user_id, is_default: true },
        { is_default: false }
      );
    }

    // Encrypt sensitive card information using user's public key
    console.log("Encrypting card information...");
    const encryptedCardHolderName = rsaEncrypt(card_holder_name, publicKey);
    const encryptedCardNumber = rsaEncrypt(card_number.slice(-4), publicKey); // Store only last 4 digits
    const encryptedExpiryMonth = rsaEncrypt(expiry_month, publicKey);
    const encryptedExpiryYear = rsaEncrypt(expiry_year, publicKey);
    const encryptedCvv = rsaEncrypt(cvv, publicKey);

    // Encrypt billing address
    const encryptedBillingAddress = {
      street: rsaEncrypt(billing_address.street, publicKey),
      city: rsaEncrypt(billing_address.city, publicKey),
      state: rsaEncrypt(billing_address.state, publicKey),
      zip_code: rsaEncrypt(billing_address.zip_code, publicKey),
      country: rsaEncrypt(billing_address.country || "US", publicKey),
    };

    console.log("Card information encrypted successfully");

    // Create payment card record
    const paymentCard = new PaymentCard({
      user_id,
      card_holder_name: encryptedCardHolderName,
      card_number: encryptedCardNumber,
      expiry_month: encryptedExpiryMonth,
      expiry_year: encryptedExpiryYear,
      cvv: encryptedCvv,
      billing_address: encryptedBillingAddress,
      is_default: is_default || false,
    });

    await paymentCard.save();
    console.log("Payment card saved successfully:", paymentCard._id);
    
    res.status(201).json({ 
      message: "Payment card added successfully", 
      card: {
        id: paymentCard._id,
        card_number: `**** **** **** ${card_number.slice(-4)}`,
        card_holder_name,
        is_default: paymentCard.is_default,
        created_at: paymentCard.created_at
      }
    });
  } catch (error: any) {
    console.error("Error adding payment card:", error);
    res.status(500).json({ message: "Failed to add payment card", error: error.message });
  }
};

// Get user's payment cards
export const getUserPaymentCards = async (req: any, res: any) => {
  const { user_id } = req.params;

  console.log("Fetching payment cards for user:", user_id);

  try {
    const cards = await PaymentCard.find({ user_id, is_active: true })
      .sort({ is_default: -1, created_at: -1 });

    // Get user's private key for decryption
    console.log("Fetching private key for decryption...");
    const privateKey = await getPrivateKey(user_id);
    if (!privateKey) {
      console.error("No private key found for user:", user_id);
      return res.status(500).json({ message: "No private key for user" });
    }

    console.log("Private key retrieved successfully, decrypting cards...");

    // Decrypt card information
    const decryptedCards = cards.map((card: any) => ({
      id: card._id,
      card_holder_name: rsaDecrypt(card.card_holder_name, privateKey),
      card_number: `**** **** **** ${rsaDecrypt(card.card_number, privateKey)}`,
      expiry_month: rsaDecrypt(card.expiry_month, privateKey),
      expiry_year: rsaDecrypt(card.expiry_year, privateKey),
      billing_address: {
        street: rsaDecrypt(card.billing_address.street, privateKey),
        city: rsaDecrypt(card.billing_address.city, privateKey),
        state: rsaDecrypt(card.billing_address.state, privateKey),
        zip_code: rsaDecrypt(card.billing_address.zip_code, privateKey),
        country: rsaDecrypt(card.billing_address.country, privateKey),
      },
      is_default: card.is_default,
      created_at: card.created_at,
    }));

    console.log(`Successfully decrypted ${decryptedCards.length} cards for user:`, user_id);

    res.status(200).json(decryptedCards);
  } catch (error: any) {
    console.error("Error fetching payment cards:", error);
    res.status(500).json({ message: "Failed to fetch payment cards", error: error.message });
  }
};

// Update payment card
export const updatePaymentCard = async (req: any, res: any) => {
  const { card_id } = req.params;
  const { 
    card_holder_name,
    expiry_month,
    expiry_year,
    billing_address,
    is_default
  } = req.body;

  console.log("Updating payment card:", card_id);

  try {
    const card = await PaymentCard.findById(card_id);
    if (!card) {
      return res.status(404).json({ message: "Payment card not found" });
    }

    // Get user's public key for encryption
    const publicKey = await getPublicKey(card.user_id.toString());
    if (!publicKey) {
      console.error("No public key found for user:", card.user_id);
      return res.status(500).json({ message: "No public key for user" });
    }

    // If setting as default, unset other default cards
    if (is_default) {
      await PaymentCard.updateMany(
        { user_id: card.user_id, is_default: true },
        { is_default: false }
      );
    }

    // Update fields that are provided
    const updateData: any = {};
    if (card_holder_name) updateData.card_holder_name = rsaEncrypt(card_holder_name, publicKey);
    if (expiry_month) updateData.expiry_month = rsaEncrypt(expiry_month, publicKey);
    if (expiry_year) updateData.expiry_year = rsaEncrypt(expiry_year, publicKey);
    if (is_default !== undefined) updateData.is_default = is_default;
    
    if (billing_address) {
      updateData.billing_address = {
        street: billing_address.street ? rsaEncrypt(billing_address.street, publicKey) : card.billing_address.street,
        city: billing_address.city ? rsaEncrypt(billing_address.city, publicKey) : card.billing_address.city,
        state: billing_address.state ? rsaEncrypt(billing_address.state, publicKey) : card.billing_address.state,
        zip_code: billing_address.zip_code ? rsaEncrypt(billing_address.zip_code, publicKey) : card.billing_address.zip_code,
        country: billing_address.country ? rsaEncrypt(billing_address.country, publicKey) : card.billing_address.country,
      };
    }

    const updatedCard = await PaymentCard.findByIdAndUpdate(
      card_id,
      updateData,
      { new: true }
    );

    console.log("Payment card updated successfully:", card_id);

    res.status(200).json({ 
      message: "Payment card updated successfully", 
      card: {
        id: updatedCard._id,
        is_default: updatedCard.is_default,
        updated_at: updatedCard.updated_at
      }
    });
  } catch (error: any) {
    console.error("Error updating payment card:", error);
    res.status(500).json({ message: "Failed to update payment card", error: error.message });
  }
};

// Delete payment card
export const deletePaymentCard = async (req: any, res: any) => {
  const { card_id } = req.params;

  console.log("Deleting payment card:", card_id);

  try {
    const card = await PaymentCard.findByIdAndUpdate(
      card_id,
      { is_active: false },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Payment card not found" });
    }

    console.log("Payment card deleted successfully:", card_id);

    res.status(200).json({ 
      message: "Payment card deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting payment card:", error);
    res.status(500).json({ message: "Failed to delete payment card", error: error.message });
  }
};

// Set default payment card
export const setDefaultPaymentCard = async (req: any, res: any) => {
  const { card_id } = req.params;
  const { user_id } = req.body;

  console.log("Setting default payment card:", card_id, "for user:", user_id);

  try {
    // Unset all default cards for user
    await PaymentCard.updateMany(
      { user_id, is_default: true },
      { is_default: false }
    );

    // Set the specified card as default
    const updatedCard = await PaymentCard.findByIdAndUpdate(
      card_id,
      { is_default: true },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Payment card not found" });
    }

    console.log("Default payment card set successfully:", card_id);

    res.status(200).json({ 
      message: "Default payment card updated successfully" 
    });
  } catch (error: any) {
    console.error("Error setting default payment card:", error);
    res.status(500).json({ message: "Failed to set default payment card", error: error.message });
  }
};

import { Request, Response } from "express";
import Vet from "../models/Vet";
import User from "../models/User";
import { getPublicKey, getPrivateKey } from "../utils/keyManager";
import { aesDecrypt } from "../utils/aesUtils";
import { rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";

// Search vets by decrypted name/location
export const searchVets = async (req: Request, res: Response) => {
  try {
    const { location } = req.body;
    const vets = await Vet.find({}).populate("user");
    const results = [];
    for (const vet of vets) {
      const user = vet.user;
      const privateKey = await getPrivateKey(user._id.toString());
      if (!privateKey) continue;
      const decryptedLocation = rsaDecrypt(vet.location, privateKey);
      if (
        decryptedLocation.toLowerCase().includes((location || "").toLowerCase())
      ) {
        results.push({
          _id: vet._id,
          name: rsaDecrypt(vet.name, privateKey),
          location: decryptedLocation,
          specialization: vet.specialization,
          certifications: vet.certifications,
          createdAt: vet.createdAt,
          user: vet.user
        });
      }
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to search vets", error });
  }
};

export const editVet = async (req: any, res: any) => {
  try {
    // Encrypt certifications if present
    let updateData = { ...req.body };
    if (updateData.certifications && Array.isArray(updateData.certifications)) {
      const vet = await Vet.findById(req.params.id).populate("user");
      if (vet && vet.user) {
        const publicKey = await getPublicKey(vet.user._id.toString());
        if (publicKey) {
          updateData.certifications = updateData.certifications.map((cert: string) => rsaEncrypt(cert, publicKey));
        }
      }
    }
    const vet = await Vet.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    res.status(200).json(vet);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update vet", error });
  }
};

export const getVetById = async (req: any, res: any) => {
  try {
    const vet = await Vet.findById(req.params.id).populate("user");
    if (!vet) {
      console.error("[getVetById] Vet not found for id:", req.params.id);
      return res.status(404).json({ message: "Vet not found" });
    }
    // Decrypt vet name/location and certifications using user's private key
    const user = vet.user;
    if (!user) {
      console.error(`[getVetById] Vet found but user field is missing. Vet:`, vet);
      return res.status(500).json({ message: "Vet found but user field is missing" });
    }
    const userId = user._id ? user._id.toString() : user.toString();
    const privateKey = await getPrivateKey(userId);
    if (!privateKey) {
      console.error(`[getVetById] No private key for userId: ${userId}`);
      return res.status(500).json({ message: `No private key for user ${userId}` });
    }
    let decryptedName = "[decryption failed]";
    let decryptedLocation = "[decryption failed]";
    let decryptedCerts = [];
    try {
      decryptedName = rsaDecrypt(vet.name, privateKey);
    } catch (e) {
      console.error(`[getVetById] Failed to decrypt vet name for vetId: ${vet._id}`);
    }
    try {
      decryptedLocation = rsaDecrypt(vet.location, privateKey);
    } catch (e) {
      console.error(`[getVetById] Failed to decrypt vet location for vetId: ${vet._id}`);
    }
    if (Array.isArray(vet.certifications)) {
      decryptedCerts = vet.certifications.map((cert: string, idx: number) => {
        try {
          return rsaDecrypt(cert, privateKey);
        } catch (e) {
          console.error(`[getVetById] Failed to decrypt certification #${idx} for vetId: ${vet._id}`);
          return "[decryption failed]";
        }
      });
    } else {
      decryptedCerts = vet.certifications;
    }
    const decryptedVet = {
      ...vet.toObject(),
      name: decryptedName,
      location: decryptedLocation,
      certifications: decryptedCerts
    };
    res.status(200).json(decryptedVet);
  } catch (error: any) {
    console.error("[getVetById] Exception:", error);
    res.status(500).json({ message: "Failed to fetch vet", error });
  }
};

export const newVet = async (req: any, res: any) => {
  try {
    const { name, location, specialization, certifications, user } = req.body;
    // Encrypt name/location with user's public key
    const userDoc = await User.findById(user);
    if (!userDoc) return res.status(404).json({ message: "User not found for vet" });
    const publicKey = userDoc.publicKey;
    if (!publicKey) return res.status(500).json({ message: "No public key for user" });
    const encryptedName = rsaEncrypt(name, publicKey);
    const encryptedLocation = rsaEncrypt(location, publicKey);
    const vet = await Vet.create({
      name: encryptedName,
      location: encryptedLocation,
      specialization,
      certifications,
      user
    });
    const newVet = await Vet.findById(vet._id).populate("user");
    // Decrypt for response
          const privateKey = await getPrivateKey(userDoc._id.toString());
    if (!privateKey) return res.status(500).json({ message: "No private key for user" });
    const decryptedVet = {
      ...newVet.toObject(),
      name: rsaDecrypt(newVet.name, privateKey),
      location: rsaDecrypt(newVet.location, privateKey)
    };
    res.status(201).json(decryptedVet);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create vet", error });
  }
};

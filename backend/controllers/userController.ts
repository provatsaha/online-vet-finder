import { Request, Response } from "express";

import User from "../models/User";
import Vet from "../models/Vet";
import { hashPassword, verifyPassword, generateSalt, generateNonce, rsaEncrypt, rsaDecrypt } from "../utils/cryptoUtils";
import { initializeUserKeys, getPrivateKey } from "../utils/keyManager";
import { aesEncrypt, aesDecrypt } from "../utils/aesUtils";
import mongoose from "mongoose";

// Separate function for credential check
async function checkCredentials(email: string, password: string) {
	const user = await User.findOne({ email });
	if (!user) return null;
	
	
	if (!user.salt || !user.nonce) {
		return null;
	}
	
	const valid = verifyPassword(password, user.passwordHash, user.salt, user.nonce);
	if (!valid) return null;
	return user;
}

// Function to handle existing users without encryption keys
async function ensureUserHasKeys(user: any) {
	if (!user.publicKey || user.publicKey === "temp") {
		try {
			
			const { publicKey } = await initializeUserKeys(user._id.toString());
			
			// Encrypt existing data with new public key
			const encryptedName = rsaEncrypt(user.name, publicKey);
			const encryptedAddress = rsaEncrypt(user.address, publicKey);
			
			// Update user 
			user.name = encryptedName;
			user.address = encryptedAddress;
			user.publicKey = aesEncrypt(publicKey);
			await user.save();
			
			console.log(`Generated new keys for existing user: ${user._id}`);
		} catch (error) {
			console.error(`Failed to generate keys for existing user ${user._id}:`, error);
			return false;
		}
	}
	return true;
}

export const signup = async (req: any, res: any) => {
	try {
		let { name, email, address, password, type } = req.body;
		if (!type) type = "user";
		
		// Validate required fields
		if (!name || !email || !address || !password) {
			return res.status(400).json({ 
				message: "All fields (name, email, address, password) are required" 
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User with this email already exists" });
		}
		
		// Generate salt and nonce
		const salt = generateSalt();
		const nonce = generateNonce();
		// Hash password with salt and nonce
		const hash = hashPassword(password, salt, nonce);

		// Generate RSA key pair for user first
		const tempUserId = new mongoose.Types.ObjectId().toString();
		const { publicKey } = await initializeUserKeys(tempUserId);

		// Encrypt user info with their own public key
		const encryptedName = rsaEncrypt(name, publicKey);
		const encryptedAddress = rsaEncrypt(address, publicKey);

		// Create user with encrypted data and AES-encrypted public key
		const user = await User.create({
			_id: tempUserId,
			name: encryptedName,
			email,
			address: encryptedAddress,
			passwordHash: hash,
			salt,
			nonce,
			publicKey: aesEncrypt(publicKey),
			type,
		});

		let vetId = null;
		if (type === "vet") {
			// Create Vet document linked to this user with encrypted data
			const vetDoc = await Vet.create({
				name: encryptedName, 
				location: encryptedAddress, 
				specialization: req.body.specialization || "",
				certifications: req.body.certifications || [],
				user: user._id
			});
			vetId = vetDoc._id;
		}

		res.status(201).json({ 
			message: "User created successfully", 
			user: { id: user._id, vetId },
			userType: type
		});
	} catch (error: any) {
		console.error("Signup error:", error);
		
		// Clean up any created keys if user creation failed
		if (error.message.includes("RSA") || error.message.includes("key")) {
			console.error("RSA key generation failed, cleaning up...");
		}
		
		res.status(500).json({ 
			message: "Failed to create user", 
			error: error.message 
		});
	}
};

export const getProfileById = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: "User not found" });
		
		await ensureUserHasKeys(user);
		
		// Decrypt user info using user's private key
		const privateKey = await getPrivateKey(user._id.toString());
		if (!privateKey) return res.status(500).json({ message: "Private key not found for user" });
		const userInfo = {
			_id: user._id,
			name: rsaDecrypt(user.name, privateKey),
			email: user.email,
			address: rsaDecrypt(user.address, privateKey),
			type: user.type,
			createdAt: user.createdAt
		};
		return res.status(200).json(userInfo);
	} catch (error: any) {
		console.error("GetProfileById error:", error);
		res.status(500).json({ message: "Failed to fetch user", error: error.message });
	}
};
export const login = async (req: any, res: any) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required." });
		}
		// Use the separate credential check function with plaintext email
		const user = await checkCredentials(email, password);
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password." });
		}
		
		await ensureUserHasKeys(user);
		
		
		const privateKey = await getPrivateKey(user._id.toString());
		if (!privateKey) {
			return res.status(500).json({ message: "Private key not found for user" });
		}
		const responsePayload: any = {
			message: "Login successful",
			user: {
				id: user._id,
				name: rsaDecrypt(user.name, privateKey),
				email: user.email,
				address: rsaDecrypt(user.address, privateKey),
				type: user.type,
			},
		};
		const vet = await Vet.findOne({ user: user._id });
		if (vet) {
			responsePayload.user.vetId = vet._id;
		}
		res.status(200).json(responsePayload);
	} catch (error: any) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Login failed", error: error.message });
	}
};

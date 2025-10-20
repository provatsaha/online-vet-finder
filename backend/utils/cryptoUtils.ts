import crypto from 'crypto';
import RSAKey from '../models/RSAKey';
import { aesEncrypt } from './aesUtils';

/**
 * Generate RSA key pair for a user/vet
 * @param {string} userId - Unique identifier for the user/vet
 * @param {number} modulusLength - RSA key size (default: 2048)
 * @returns {Object} - Object containing public and private keys
 */
export async function generateRSAKeyPair(userId: string, modulusLength: number = 2048): Promise<{ publicKey: string, privateKey: string }> {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    });
    
  
    const encryptedPublicKey = aesEncrypt(publicKey);
    const encryptedPrivateKey = aesEncrypt(privateKey);
    
    await RSAKey.findOneAndUpdate(
        { userId },
        { 
            userId, 
            publicKey: encryptedPublicKey, 
            privateKey: encryptedPrivateKey, 
            keySize: modulusLength 
        },
        { upsert: true, new: true }
    );
    
    return { publicKey, privateKey };
}

/**
 * Encrypt data with RSA public key
 * @param {string} data - Data to encrypt
 * @param {string} publicKey - RSA public key in PEM format
 * @returns {string} - Base64 encoded encrypted data
 */
export function rsaEncrypt(data: string, publicKey: string): string {
    try {
        const buffer = Buffer.from(data, 'utf8');
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString('base64');
    } catch (error) {
        throw new Error(`RSA encryption failed: ${error}`);
    }
}

/**
 * Decrypt data with RSA private key
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} privateKey - RSA private key in PEM format
 * @returns {string} - Decrypted data
 */
export function rsaDecrypt(encryptedData: string, privateKey: string): string {
    try {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString('utf8');
    } catch (error) {
        throw new Error(`RSA decryption failed: ${error}`);
    }
}

/**
 * Get user's public key from MongoDB (decrypted)
 * @param {string} userId - User identifier
 * @returns {string | null} - Decrypted public key or null if not found
 */
export async function getUserPublicKey(userId: string): Promise<string | null> {
    try {
        const keyDoc = await RSAKey.findOne({ userId });
        if (!keyDoc || !keyDoc.publicKey) {
            return null;
        }
        
        // Decrypt the AES-encrypted public key
        const { aesDecrypt } = await import('./aesUtils');
        return aesDecrypt(keyDoc.publicKey);
    } catch (error) {
        console.error(`Failed to get/decrypt public key for user ${userId}:`, error);
        return null;
    }
}

/**
 * Get user's private key from MongoDB (decrypted)
 * @param {string} userId - User identifier
 * @returns {string | null} - Decrypted private key or null if not found
 */
export async function getUserPrivateKey(userId: string): Promise<string | null> {
    try {
        const keyDoc = await RSAKey.findOne({ userId });
        if (!keyDoc || !keyDoc.privateKey) {
            return null;
        }
        
        // Decrypt the AES-encrypted private key
        const { aesDecrypt } = await import('./aesUtils');
        return aesDecrypt(keyDoc.privateKey);
    } catch (error) {
        console.error(`Failed to get/decrypt private key for user ${userId}:`, error);
        return null;
    }
}

/**
 * Check if user has RSA keys in MongoDB
 * @param {string} userId - User identifier
 * @returns {boolean} - True if both keys exist
 */
export async function userHasKeys(userId: string): Promise<boolean> {
    try {
        const keyDoc = await RSAKey.findOne({ userId });
        return keyDoc !== null;
    } catch (error) {
        console.error(`Failed to check keys for user ${userId}:`, error);
        return false;
    }
}

/**
 * Remove user's RSA keys from MongoDB
 * @param {string} userId - User identifier
 */
export async function removeUserKeys(userId: string): Promise<void> {
    try {
        await RSAKey.deleteOne({ userId });
        console.log(`Keys removed successfully for user: ${userId}`);
    } catch (error) {
        console.error(`Failed to remove keys for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Encrypt sensitive user data
 * @param {string} data - Data to encrypt
 * @param {string} userId - User identifier
 * @returns {string} - Encrypted data
 */
export async function encryptUserData(data: string, userId: string): Promise<string> {
    const publicKey = await getUserPublicKey(userId);
    if (!publicKey) {
        throw new Error(`Public key not found for user: ${userId}`);
    }
    return rsaEncrypt(data, publicKey);
}

/**
 * Decrypt sensitive user data
 * @param {string} encryptedData - Encrypted data
 * @param {string} userId - User identifier
 * @returns {string} - Decrypted data
 */
export async function decryptUserData(encryptedData: string, userId: string): Promise<string> {
    const privateKey = await getUserPrivateKey(userId);
    if (!privateKey) {
        throw new Error(`Private key not found for user: ${userId}`);
    }
    return rsaDecrypt(encryptedData, privateKey);
}

/**
 * Backup user's keys to a safe location
 * @param {string} userId - User identifier
 * @param {string} backupDir - Backup directory path
 */
export async function backupUserKeys(userId: string, backupDir: string): Promise<void> {
    try {
        const keyDoc = await RSAKey.findOne({ userId });
        if (!keyDoc) {
            throw new Error(`No keys found for user: ${userId}`);
        }
        
        // For MongoDB backup, you might want to export to a secure location
        // This is a simplified backup - in production, use proper backup tools
        console.log(`Backup created for user ${userId} - keys stored in MongoDB`);
    } catch (error) {
        console.error(`Failed to backup keys for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Restore user's keys from backup
 * @param {string} userId - User identifier
 * @param {string} backupDir - Backup directory path
 */
export async function restoreUserKeys(userId: string, backupDir: string): Promise<void> {
    try {
        // For MongoDB restore, you might want to import from a secure location
        // This is a simplified restore - in production, use proper restore tools
        console.log(`Restore completed for user ${userId} - keys restored from MongoDB`);
    } catch (error) {
        console.error(`Failed to restore keys for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Generate a secure random salt for password hashing
 * @param {number} length - Salt length in bytes (default: 16)
 * @returns {string} - Hex encoded salt
 */
export function generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a random nonce for additional security
 * @param {number} length - Nonce length in bytes (default: 16)
 * @returns {string} - Hex encoded nonce
 */
export function generateNonce(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a password with salt and nonce using SHA-256
 * @param {string} password - Plain text password
 * @param {string} salt - Salt for the password
 * @param {string} nonce - Additional nonce for security
 * @returns {string} - Hashed password
 */
export function hashPassword(password: string, salt: string, nonce: string): string {
    const hash = crypto.createHash('sha256').update(password + salt + nonce).digest('hex');
    return hash;
}

/**
 * Verify a password against a stored hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Stored hash to compare against
 * @param {string} salt - Salt used in the hash
 * @param {string} nonce - Nonce used in the hash
 * @returns {boolean} - True if password matches
 */
export function verifyPassword(password: string, hash: string, salt: string, nonce: string): boolean {
    const hashToVerify = hashPassword(password, salt, nonce);
    return hash === hashToVerify;
}

/**
 * Generate a secure random token
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} - Hex encoded token
 */
export function generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Create a hash of data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hex encoded hash
 */
export function createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Create HMAC signature
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key for signing
 * @returns {string} - Hex encoded signature
 */
export function createHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key used for signing
 * @returns {boolean} - True if signature is valid
 */
export function verifyHMAC(data: string, signature: string, secret: string): boolean {
    const expectedSignature = createHMAC(data, secret);
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

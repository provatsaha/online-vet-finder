import { 
    generateRSAKeyPair, 
    getUserPublicKey, 
    getUserPrivateKey, 
    userHasKeys, 
    encryptUserData,
    decryptUserData,
    backupUserKeys,
    restoreUserKeys
} from './cryptoUtils';
import RSAKey from '../models/RSAKey';


export class KeyManager {
    private static instance: KeyManager;
    
    private constructor() {}
    
   
    public static getInstance(): KeyManager {
        if (!KeyManager.instance) {
            KeyManager.instance = new KeyManager();
        }
        return KeyManager.instance;
    }
    
    /**
     * Initialize RSA keys for a new user or vet
     * @param {string} userId - Unique identifier for the user/vet
     * @param {number} keySize - RSA key size (default: 2048)
     * @returns {Object} - Object containing public and private keys
     */
    public async initializeUserKeys(userId: string, keySize: number = 2048): Promise<{ publicKey: string, privateKey: string }> {
        try {
            if (await userHasKeys(userId)) {
                throw new Error(`Keys already exist for user: ${userId}`);
            }
            
            const keyPair = await generateRSAKeyPair(userId, keySize);
            console.log(`RSA keys generated successfully for user: ${userId}`);
            return keyPair;
        } catch (error) {
            console.error(`Failed to initialize keys for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Get user's public key
     * @param {string} userId - User identifier
     * @returns {string} - Public key
     */
    public async getPublicKey(userId: string): Promise<string> {
        const publicKey = await getUserPublicKey(userId);
        if (!publicKey) {
            throw new Error(`Public key not found for user: ${userId}`);
        }
        return publicKey;
    }
    
    /**
     * Get user's private key
     * @param {string} userId - User identifier
     * @returns {string} - Private key
     */
    public async getPrivateKey(userId: string): Promise<string> {
        const privateKey = await getUserPrivateKey(userId);
        if (!privateKey) {
            throw new Error(`Private key not found for user: ${userId}`);
        }
        return privateKey;
    }
    
    /**
     * Check if user has valid keys
     * @param {string} userId - User identifier
     * @returns {boolean} - True if keys exist
     */
    public async hasValidKeys(userId: string): Promise<boolean> {
        return await userHasKeys(userId);
    }
    
    /**
     * Encrypt sensitive data for a specific user
     * @param {string} data - Data to encrypt
     * @param {string} userId - User identifier
     * @returns {string} - Encrypted data
     */
    public async encryptData(data: string, userId: string): Promise<string> {
        try {
            return await encryptUserData(data, userId);
        } catch (error) {
            console.error(`Failed to encrypt data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt data for a specific user
     * @param {string} encryptedData - Encrypted data
     * @param {string} userId - User identifier
     * @returns {string} - Decrypted data
     */
    public async decryptData(encryptedData: string, userId: string): Promise<string> {
        try {
            return await decryptUserData(encryptedData, userId);
        } catch (error) {
            console.error(`Failed to decrypt data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Remove user's keys (useful for account deletion)
     * @param {string} userId - User identifier
     */
    public async removeUserKeys(userId: string): Promise<void> {
        try {
            // Import RSAKey model directly for this operation
            const RSAKey = (await import('../models/RSAKey')).default;
            await RSAKey.deleteOne({ userId });
            console.log(`Keys removed successfully for user: ${userId}`);
        } catch (error) {
            console.error(`Failed to remove keys for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Backup user's keys to a safe location
     * @param {string} userId - User identifier
     * @param {string} backupDir - Backup directory path
     */
    public async backupKeys(userId: string, backupDir: string): Promise<void> {
        try {
            await backupUserKeys(userId, backupDir);
            console.log(`Keys backed up successfully for user: ${userId}`);
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
    public async restoreKeys(userId: string, backupDir: string): Promise<void> {
        try {
            await restoreUserKeys(userId, backupDir);
            console.log(`Keys restored successfully for user: ${userId}`);
        } catch (error) {
            console.error(`Failed to restore keys for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Validate key pair for a user
     * @param {string} userId - User identifier
     * @returns {boolean} - True if keys are valid
     */
    public async validateKeys(userId: string): Promise<boolean> {
        try {
            if (!(await userHasKeys(userId))) {
                return false;
            }
            
            // Test encryption/decryption to validate keys
            const testData = "test_validation_data";
            const encrypted = await this.encryptData(testData, userId);
            const decrypted = await this.decryptData(encrypted, userId);
            
            return testData === decrypted;
        } catch (error) {
            console.error(`Key validation failed for user ${userId}:`, error);
            return false;
        }
    }
    
    /**
     * Get key information for a user
     * @param {string} userId - User identifier
     * @returns {Object} - Key information
     */
    public async getKeyInfo(userId: string): Promise<{
        hasKeys: boolean;
        isValid: boolean;
        publicKeyExists: boolean;
        privateKeyExists: boolean;
    }> {
        const hasKeys = await userHasKeys(userId);
        const isValid = hasKeys ? await this.validateKeys(userId) : false;
        
        return {
            hasKeys,
            isValid,
            publicKeyExists: (await getUserPublicKey(userId)) !== null,
            privateKeyExists: (await getUserPrivateKey(userId)) !== null
        };
    }
}

// Export singleton instance
export const keyManager = KeyManager.getInstance();

// Export individual functions for backward compatibility
export const initializeUserKeys = (userId: string, keySize?: number) => 
    keyManager.initializeUserKeys(userId, keySize);

export const getPublicKey = (userId: string) => 
    keyManager.getPublicKey(userId);

export const getPrivateKey = (userId: string) => 
    keyManager.getPrivateKey(userId);

export const hasValidKeys = (userId: string) => 
    keyManager.hasValidKeys(userId);

export const encryptData = (data: string, userId: string) => 
    keyManager.encryptData(data, userId);

export const decryptData = (encryptedData: string, userId: string) => 
    keyManager.decryptData(encryptedData, userId);

export const removeUserKeys = (userId: string) => 
    keyManager.removeUserKeys(userId);

export const backupKeys = (userId: string, backupDir: string) => 
    keyManager.backupKeys(userId, backupDir);

export const restoreKeys = (userId: string, backupDir: string) => 
    keyManager.restoreKeys(userId, backupDir);

export const validateKeys = (userId: string) => 
    keyManager.validateKeys(userId);

export const getKeyInfo = (userId: string) => 
    keyManager.getKeyInfo(userId);

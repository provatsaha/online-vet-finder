import { keyManager } from './keyManager';

/**
 * Data Encryption Service for handling sensitive data encryption/decryption
 * Uses RSA encryption with individual user keys stored in MongoDB
 */
export class DataEncryptionService {
    private static instance: DataEncryptionService;
    
    private constructor() {}
    
    /**
     * Get singleton instance of DataEncryptionService
     */
    public static getInstance(): DataEncryptionService {
        if (!DataEncryptionService.instance) {
            DataEncryptionService.instance = new DataEncryptionService();
        }
        return DataEncryptionService.instance;
    }
    
    /**
     * Encrypt user's personal information
     * @param {string} data - Data to encrypt
     * @param {string} userId - User identifier
     * @returns {string} - Encrypted data
     */
    public async encryptPersonalInfo(data: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.encryptData(data, userId);
        } catch (error) {
            console.error(`Failed to encrypt personal info for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt user's personal information
     * @param {string} encryptedData - Encrypted data
     * @param {string} userId - User identifier
     * @returns {string} - Decrypted data
     */
    public async decryptPersonalInfo(encryptedData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.decryptData(encryptedData, userId);
        } catch (error) {
            console.error(`Failed to decrypt personal info for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Encrypt appointment details
     * @param {string} appointmentData - Appointment data to encrypt
     * @param {string} userId - User identifier
     * @returns {string} - Encrypted appointment data
     */
    public async encryptAppointmentData(appointmentData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.encryptData(appointmentData, userId);
        } catch (error) {
            console.error(`Failed to encrypt appointment data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt appointment details
     * @param {string} encryptedData - Encrypted appointment data
     * @param {string} userId - User identifier
     * @returns {string} - Decrypted appointment data
     */
    public async decryptAppointmentData(encryptedData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.decryptData(encryptedData, userId);
        } catch (error) {
            console.error(`Failed to decrypt appointment data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Encrypt payment information
     * @param {string} paymentData - Payment data to encrypt
     * @param {string} userId - User identifier
     * @returns {string} - Encrypted payment data
     */
    public async encryptPaymentData(paymentData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.encryptData(paymentData, userId);
        } catch (error) {
            console.error(`Failed to encrypt payment data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt payment information
     * @param {string} encryptedData - Encrypted payment data
     * @param {string} userId - User identifier
     * @returns {string} - Decrypted payment data
     */
    public async decryptPaymentData(encryptedData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.decryptData(encryptedData, userId);
        } catch (error) {
            console.error(`Failed to decrypt payment data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Encrypt pet information
     * @param {string} petData - Pet data to encrypt
     * @param {string} userId - User identifier
     * @returns {string} - Encrypted pet data
     */
    public async encryptPetData(petData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.encryptData(petData, userId);
        } catch (error) {
            console.error(`Failed to encrypt pet data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt pet information
     * @param {string} encryptedData - Encrypted pet data
     * @param {string} userId - User identifier
     * @returns {string} - Decrypted pet data
     */
    public async decryptPetData(encryptedData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.decryptData(encryptedData, userId);
        } catch (error) {
            console.error(`Failed to decrypt pet data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Encrypt vet service information
     * @param {string} serviceData - Service data to encrypt
     * @param {string} vetId - Vet identifier
     * @returns {string} - Encrypted service data
     */
    public async encryptVetServiceData(serviceData: string, vetId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(vetId))) {
                throw new Error(`Vet ${vetId} does not have valid encryption keys`);
            }
            return await keyManager.encryptData(serviceData, vetId);
        } catch (error) {
            console.error(`Failed to encrypt service data for vet ${vetId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt vet service information
     * @param {string} encryptedData - Encrypted service data
     * @param {string} vetId - Vet identifier
     * @returns {string} - Decrypted service data
     */
    public async decryptVetServiceData(encryptedData: string, vetId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(vetId))) {
                throw new Error(`Vet ${vetId} does not have valid encryption keys`);
            }
            return await keyManager.decryptData(encryptedData, vetId);
        } catch (error) {
            console.error(`Failed to decrypt service data for vet ${vetId}:`, error);
            throw error;
        }
    }
    
    /**
     * Encrypt emergency contact information
     * @param {string} emergencyData - Emergency data to encrypt
     * @param {string} userId - User identifier
     * @returns {string} - Encrypted emergency data
     */
    public async encryptEmergencyData(emergencyData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.encryptData(emergencyData, userId);
        } catch (error) {
            console.error(`Failed to encrypt emergency data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Decrypt emergency contact information
     * @param {string} encryptedData - Encrypted emergency data
     * @param {string} userId - User identifier
     * @returns {string} - Decrypted emergency data
     */
    public async decryptEmergencyData(encryptedData: string, userId: string): Promise<string> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                throw new Error(`User ${userId} does not have valid encryption keys`);
            }
            return await keyManager.decryptData(encryptedData, userId);
        } catch (error) {
            console.error(`Failed to decrypt emergency data for user ${userId}:`, error);
            throw error;
        }
    }
    
    /**
     * Batch encrypt multiple data fields for a user
     * @param {Object} dataObject - Object containing data to encrypt
     * @param {string} userId - User identifier
     * @returns {Object} - Object with encrypted data
     */
    public async batchEncryptData(dataObject: Record<string, string>, userId: string): Promise<Record<string, string>> {
        const encryptedObject: Record<string, string> = {};
        
        for (const [key, value] of Object.entries(dataObject)) {
            try {
                encryptedObject[key] = await this.encryptPersonalInfo(value, userId);
            } catch (error) {
                console.error(`Failed to encrypt field ${key} for user ${userId}:`, error);
                throw error;
            }
        }
        
        return encryptedObject;
    }
    
    /**
     * Batch decrypt multiple data fields for a user
     * @param {Object} encryptedObject - Object containing encrypted data
     * @param {string} userId - User identifier
     * @returns {Object} - Object with decrypted data
     */
    public async batchDecryptData(encryptedObject: Record<string, string>, userId: string): Promise<Record<string, string>> {
        const decryptedObject: Record<string, string> = {};
        
        for (const [key, value] of Object.entries(encryptedObject)) {
            try {
                decryptedObject[key] = await this.decryptPersonalInfo(value, userId);
            } catch (error) {
                console.error(`Failed to decrypt field ${key} for user ${userId}:`, error);
                throw error;
            }
        }
        
        return decryptedObject;
    }
}

// Export singleton instance
export const dataEncryptionService = DataEncryptionService.getInstance();

// Export individual functions for backward compatibility
export const encryptPersonalInfo = (data: string, userId: string) => 
    dataEncryptionService.encryptPersonalInfo(data, userId);

export const decryptPersonalInfo = (encryptedData: string, userId: string) => 
    dataEncryptionService.decryptPersonalInfo(encryptedData, userId);

export const encryptAppointmentData = (data: string, userId: string) => 
    dataEncryptionService.encryptAppointmentData(data, userId);

export const decryptAppointmentData = (encryptedData: string, userId: string) => 
    dataEncryptionService.decryptAppointmentData(encryptedData, userId);

export const encryptPaymentData = (data: string, userId: string) => 
    dataEncryptionService.encryptPaymentData(data, userId);

export const decryptPaymentData = (encryptedData: string, userId: string) => 
    dataEncryptionService.decryptPaymentData(encryptedData, userId);

export const encryptPetData = (data: string, userId: string) => 
    dataEncryptionService.encryptPetData(data, userId);

export const decryptPetData = (encryptedData: string, userId: string) => 
    dataEncryptionService.decryptPetData(encryptedData, userId);

export const encryptVetServiceData = (data: string, vetId: string) => 
    dataEncryptionService.encryptVetServiceData(data, vetId);

export const decryptVetServiceData = (encryptedData: string, vetId: string) => 
    dataEncryptionService.decryptVetServiceData(encryptedData, vetId);

export const encryptEmergencyData = (data: string, userId: string) => 
    dataEncryptionService.encryptEmergencyData(data, userId);

export const decryptEmergencyData = (encryptedData: string, userId: string) => 
    dataEncryptionService.decryptEmergencyData(encryptedData, userId);

export const batchEncryptData = (dataObject: Record<string, string>, userId: string) => 
    dataEncryptionService.batchEncryptData(dataObject, userId);

export const batchDecryptData = (encryptedObject: Record<string, string>, userId: string) => 
    dataEncryptionService.batchDecryptData(encryptedObject, userId);

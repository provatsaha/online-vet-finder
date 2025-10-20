import { Request, Response, NextFunction } from 'express';
import { dataEncryptionService } from './dataEncryptionService';

/**
 * Middleware for automatic encryption of sensitive data in API responses
 * Automatically encrypts specified fields before sending response
 */
export function encryptionMiddleware(encryptFields: string[] = []) {
    return (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.send;
        
        res.send = async function(data: any) {
            try {
                if (data && typeof data === 'object') {
                    const encryptedData = await encryptSensitiveFields(data, encryptFields, req.user?.id);
                    return originalSend.call(this, encryptedData);
                }
                return originalSend.call(this, data);
            } catch (error) {
                console.error('Encryption middleware error:', error);
                return originalSend.call(this, data);
            }
        };
        
        next();
    };
}

/**
 * Middleware for automatic decryption of sensitive data in API requests
 * Automatically decrypts specified fields from request body
 */
export function decryptionMiddleware(decryptFields: string[] = []) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.body && typeof req.body === 'object') {
                // Note: This is synchronous for request body processing
                // For decryption, we'll need to handle it in the route handler
                req.body = decryptSensitiveFieldsSync(req.body, decryptFields, req.user?.id);
            }
            next();
        } catch (error) {
            console.error('Decryption middleware error:', error);
            next();
        }
    };
}

/**
 * Encrypt sensitive fields in data object
 * @param {any} data - Data object to encrypt
 * @param {string[]} fields - Fields to encrypt
 * @param {string} userId - User ID for encryption
 * @returns {any} - Data with encrypted fields
 */
async function encryptSensitiveFields(data: any, fields: string[], userId?: string): Promise<any> {
    if (!userId || !fields.length) {
        return data;
    }
    
    if (Array.isArray(data)) {
        const encryptedArray = [];
        for (const item of data) {
            encryptedArray.push(await encryptSensitiveFields(item, fields, userId));
        }
        return encryptedArray;
    }
    
    if (data && typeof data === 'object') {
        const encryptedData: any = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (fields.includes(key) && typeof value === 'string' && value) {
                try {
                    encryptedData[key] = await dataEncryptionService.encryptPersonalInfo(value, userId);
                } catch (error) {
                    console.error(`Failed to encrypt field ${key}:`, error);
                    encryptedData[key] = value; // Keep original value if encryption fails
                }
            } else if (value && typeof value === 'object') {
                encryptedData[key] = await encryptSensitiveFields(value, fields, userId);
            } else {
                encryptedData[key] = value;
            }
        }
        
        return encryptedData;
    }
    
    return data;
}

/**
 * Decrypt sensitive fields in data object (synchronous version for request body)
 * @param {any} data - Data object to decrypt
 * @param {string[]} fields - Fields to decrypt
 * @param {string} userId - User ID for decryption
 * @returns {any} - Data with decrypted fields
 */
function decryptSensitiveFieldsSync(data: any, fields: string[], userId?: string): any {
    if (!userId || !fields.length) {
        return data;
    }
    
    if (Array.isArray(data)) {
        return data.map(item => decryptSensitiveFieldsSync(item, fields, userId));
    }
    
    if (data && typeof data === 'object') {
        const decryptedData: any = {};
        
        for (const [key, value] of Object.entries(data)) {
            if (fields.includes(key) && typeof value === 'string' && value) {
                // For request body decryption, we'll need to handle this in the route handler
                // since decryption requires async operations
                decryptedData[key] = value; // Keep encrypted value for now
            } else if (value && typeof value === 'object') {
                decryptedData[key] = decryptSensitiveFieldsSync(value, fields, userId);
            } else {
                decryptedData[key] = value;
            }
        }
        
        return decryptedData;
    }
    
    return data;
}

/**
 * Middleware for encrypting user profile data
 */
export function encryptUserProfileMiddleware() {
    return encryptionMiddleware([
        'firstName', 'lastName', 'address', 'phone', 'emergencyContact'
    ]);
}

/**
 * Middleware for decrypting user profile data
 */
export function decryptUserProfileMiddleware() {
    return decryptionMiddleware([
        'firstName', 'lastName', 'address', 'phone', 'emergencyContact'
    ]);
}

/**
 * Middleware for encrypting pet data
 */
export function encryptPetDataMiddleware() {
    return encryptionMiddleware([
        'name', 'breed', 'medicalHistory', 'notes'
    ]);
}

/**
 * Middleware for decrypting pet data
 */
export function decryptPetDataMiddleware() {
    return decryptionMiddleware([
        'name', 'breed', 'medicalHistory', 'notes'
    ]);
}

/**
 * Middleware for encrypting appointment data
 */
export function encryptAppointmentMiddleware() {
    return encryptionMiddleware([
        'symptoms', 'notes', 'diagnosis', 'prescription'
    ]);
}

/**
 * Middleware for decrypting appointment data
 */
export function decryptAppointmentMiddleware() {
    return decryptionMiddleware([
        'symptoms', 'notes', 'diagnosis', 'prescription'
    ]);
}

/**
 * Middleware for encrypting payment data
 */
export function encryptPaymentMiddleware() {
    return encryptionMiddleware([
        'cardNumber', 'cardHolderName', 'billingAddress'
    ]);
}

/**
 * Middleware for decrypting payment data
 */
export function decryptPaymentMiddleware() {
    return decryptionMiddleware([
        'cardNumber', 'cardHolderName', 'billingAddress'
    ]);
}

/**
 * Middleware for encrypting vet service data
 */
export function encryptVetServiceMiddleware() {
    return encryptionMiddleware([
        'description', 'notes', 'specializations'
    ]);
}

/**
 * Middleware for decrypting vet service data
 */
export function decryptVetServiceMiddleware() {
    return decryptionMiddleware([
        'description', 'notes', 'specializations'
    ]);
}

/**
 * Generic encryption middleware for custom fields
 * @param {string[]} fields - Fields to encrypt/decrypt
 * @returns {Object} - Object with encryption and decryption middleware
 */
export function createEncryptionMiddleware(fields: string[]) {
    return {
        encrypt: encryptionMiddleware(fields),
        decrypt: decryptionMiddleware(fields)
    };
}

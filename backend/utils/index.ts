// Export all encryption and key management utilities
export * from './cryptoUtils';
export * from './keyManager';
export * from './dataEncryptionService';
export * from './encryptionMiddleware';
export * from './keyValidationUtils';

// Main exports for easy access
export { keyManager } from './keyManager';
export { dataEncryptionService } from './dataEncryptionService';

// Common encryption functions
export {
    rsaEncrypt,
    rsaDecrypt,
    generateRSAKeyPair,
    getUserPublicKey,
    getUserPrivateKey,
    userHasKeys,
    encryptUserData,
    decryptUserData
} from './cryptoUtils';

// Key management functions
export {
    initializeUserKeys,
    getPublicKey,
    getPrivateKey,
    hasValidKeys,
    encryptData,
    decryptData,
    backupKeys,
    restoreKeys,
    validateKeys,
    getKeyInfo
} from './keyManager';

// Data encryption service functions
export {
    encryptPersonalInfo,
    decryptPersonalInfo,
    encryptAppointmentData,
    decryptAppointmentData,
    encryptPaymentData,
    decryptPaymentData,
    encryptPetData,
    decryptPetData,
    encryptVetServiceData,
    decryptVetServiceData,
    encryptEmergencyData,
    decryptEmergencyData,
    batchEncryptData,
    batchDecryptData
} from './dataEncryptionService';

// Middleware functions
export {
    encryptionMiddleware,
    decryptionMiddleware,
    encryptUserProfileMiddleware,
    decryptUserProfileMiddleware,
    encryptPetDataMiddleware,
    decryptPetDataMiddleware,
    encryptAppointmentMiddleware,
    decryptAppointmentMiddleware,
    encryptPaymentMiddleware,
    decryptPaymentMiddleware,
    encryptVetServiceMiddleware,
    decryptVetServiceMiddleware,
    createEncryptionMiddleware
} from './encryptionMiddleware';

// Validation utility functions
export {
    testUserEncryption,
    validateAllKeys,
    generateTestKeys,
    cleanupTestKeys,
    getComprehensiveKeyInfo,
    performHealthCheck
} from './keyValidationUtils';

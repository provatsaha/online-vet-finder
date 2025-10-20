import { keyManager } from './keyManager';
import { dataEncryptionService } from './dataEncryptionService';
import RSAKey from '../models/RSAKey';

/**
 * Utility functions for key validation and testing
 */
export class KeyValidationUtils {
    /**
     * Test encryption/decryption for a user
     * @param {string} userId - User identifier
     * @returns {Object} - Test results
     */
    public static async testUserEncryption(userId: string): Promise<{
        success: boolean;
        message: string;
        details?: any;
    }> {
        try {
            // Check if user has keys
            if (!(await keyManager.hasValidKeys(userId))) {
                return {
                    success: false,
                    message: `User ${userId} does not have valid encryption keys`
                };
            }
            
            // Test data
            const testData = {
                firstName: "John",
                lastName: "Doe",
                address: "123 Test Street",
                phone: "+1234567890"
            };
            
            // Test encryption
            const encryptedData = await dataEncryptionService.batchEncryptData(testData, userId);
            
            // Test decryption
            const decryptedData = await dataEncryptionService.batchDecryptData(encryptedData, userId);
            
            // Verify data integrity
            const isDataValid = Object.keys(testData).every(key => 
                testData[key as keyof typeof testData] === decryptedData[key]
            );
            
            if (!isDataValid) {
                return {
                    success: false,
                    message: "Data integrity check failed - encrypted and decrypted data don't match"
                };
            }
            
            return {
                success: true,
                message: "Encryption/decryption test passed successfully",
                details: {
                    originalData: testData,
                    encryptedData,
                    decryptedData
                }
            };
            
        } catch (error) {
            return {
                success: false,
                message: `Test failed with error: ${error}`
            };
        }
    }
    
    /**
     * Validate all user keys in the system
     * @returns {Object} - Validation results
     */
    public static async validateAllKeys(): Promise<{
        totalUsers: number;
        validKeys: number;
        invalidKeys: number;
        results: Array<{ userId: string; isValid: boolean; message: string }>;
    }> {
        try {
            const keyDocs = await RSAKey.find({});
            const results: Array<{ userId: string; isValid: boolean; message: string }> = [];
            let validKeys = 0;
            let invalidKeys = 0;
            
            for (const keyDoc of keyDocs) {
                try {
                    const isValid = await keyManager.validateKeys(keyDoc.userId);
                    const message = isValid ? "Keys are valid" : "Keys are invalid";
                    
                    results.push({ userId: keyDoc.userId, isValid, message });
                    
                    if (isValid) {
                        validKeys++;
                    } else {
                        invalidKeys++;
                    }
                } catch (error) {
                    results.push({ 
                        userId: keyDoc.userId, 
                        isValid: false, 
                        message: `Validation error: ${error}` 
                    });
                    invalidKeys++;
                }
            }
            
            return {
                totalUsers: keyDocs.length,
                validKeys,
                invalidKeys,
                results
            };
        } catch (error) {
            console.error('Failed to validate all keys:', error);
            return {
                totalUsers: 0,
                validKeys: 0,
                invalidKeys: 0,
                results: []
            };
        }
    }
    
    /**
     * Generate test keys for a user
     * @param {string} userId - User identifier
     * @returns {Object} - Generation results
     */
    public static async generateTestKeys(userId: string): Promise<{
        success: boolean;
        message: string;
        keys?: { publicKey: string; privateKey: string };
    }> {
        try {
            // Check if keys already exist
            if (await keyManager.hasValidKeys(userId)) {
                return {
                    success: false,
                    message: `Keys already exist for user: ${userId}`
                };
            }
            
            // Generate new keys
            const keys = await keyManager.initializeUserKeys(userId);
            
            // Test the keys
            const testResult = await this.testUserEncryption(userId);
            
            if (!testResult.success) {
                // Remove keys if test fails
                await keyManager.removeUserKeys(userId);
                return {
                    success: false,
                    message: `Key generation succeeded but validation failed: ${testResult.message}`
                };
            }
            
            return {
                success: true,
                message: "Test keys generated and validated successfully",
                keys
            };
            
        } catch (error) {
            return {
                success: false,
                message: `Failed to generate test keys: ${error}`
            };
        }
    }
    
    /**
     * Clean up test keys for a user
     * @param {string} userId - User identifier
     * @returns {Object} - Cleanup results
     */
    public static async cleanupTestKeys(userId: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            if (!(await keyManager.hasValidKeys(userId))) {
                return {
                    success: false,
                    message: `No keys found for user: ${userId}`
                };
            }
            
            await keyManager.removeUserKeys(userId);
            
            return {
                success: true,
                message: `Test keys cleaned up successfully for user: ${userId}`
            };
            
        } catch (error) {
            return {
                success: false,
                message: `Failed to cleanup test keys: ${error}`
            };
        }
    }
    
    /**
     * Get comprehensive key information for a user
     * @param {string} userId - User identifier
     * @returns {Object} - Key information
     */
    public static async getComprehensiveKeyInfo(userId: string): Promise<{
        userId: string;
        keyInfo: any;
        testResult: any;
        recommendations: string[];
    }> {
        const keyInfo = await keyManager.getKeyInfo(userId);
        const testResult = await this.testUserEncryption(userId);
        const recommendations: string[] = [];
        
        if (!keyInfo.hasKeys) {
            recommendations.push("Generate RSA key pair for this user");
        } else if (!keyInfo.isValid) {
            recommendations.push("Regenerate RSA keys - current keys are invalid");
        } else if (!testResult.success) {
            recommendations.push("Investigate encryption/decryption issues");
        }
        
        if (keyInfo.hasKeys && keyInfo.isValid && testResult.success) {
            recommendations.push("Keys are working correctly - no action needed");
        }
        
        return {
            userId,
            keyInfo,
            testResult,
            recommendations
        };
    }
    
    /**
     * Perform system-wide encryption health check
     * @returns {Object} - Health check results
     */
    public static async performHealthCheck(): Promise<{
        timestamp: string;
        overallHealth: 'healthy' | 'warning' | 'critical';
        summary: string;
        details: any;
    }> {
        const validationResults = await this.validateAllKeys();
        const timestamp = new Date().toISOString();
        
        let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
        let summary = "All encryption keys are working correctly";
        
        if (validationResults.invalidKeys > 0) {
            overallHealth = 'critical';
            summary = `${validationResults.invalidKeys} users have invalid encryption keys`;
        } else if (validationResults.totalUsers === 0) {
            overallHealth = 'warning';
            summary = "No encryption keys found in the system";
        }
        
        return {
            timestamp,
            overallHealth,
            summary,
            details: validationResults
        };
    }
}

// Export utility functions
export const testUserEncryption = (userId: string) => 
    KeyValidationUtils.testUserEncryption(userId);

export const validateAllKeys = () => 
    KeyValidationUtils.validateAllKeys();

export const generateTestKeys = (userId: string) => 
    KeyValidationUtils.generateTestKeys(userId);

export const cleanupTestKeys = (userId: string) => 
    KeyValidationUtils.cleanupTestKeys(userId);

export const getComprehensiveKeyInfo = (userId: string) => 
    KeyValidationUtils.getComprehensiveKeyInfo(userId);

export const performHealthCheck = () => 
    KeyValidationUtils.performHealthCheck();

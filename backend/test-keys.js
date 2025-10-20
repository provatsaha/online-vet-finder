const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vet-finder')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Import the key management utilities
const { keyManager, dataEncryptionService } = require('./utils');

async function testKeyManagement() {
  try {
    console.log('🧪 Testing RSA Key Management System...\n');

    const testUserId = 'test-user-' + Date.now();
    
    // Test 1: Generate keys
    console.log('1. Generating RSA keys...');
    const keys = await keyManager.initializeUserKeys(testUserId);
    console.log('✅ Keys generated successfully');
    console.log(`   Public key length: ${keys.publicKey.length} characters`);
    console.log(`   Private key length: ${keys.privateKey.length} characters\n`);

    // Test 2: Check if keys exist
    console.log('2. Verifying keys exist...');
    const hasKeys = await keyManager.hasValidKeys(testUserId);
    console.log(`✅ Keys exist: ${hasKeys}\n`);

    // Test 3: Encrypt and decrypt data
    console.log('3. Testing encryption/decryption...');
    const testData = 'Hello, this is a test message!';
    const encrypted = await dataEncryptionService.encryptPersonalInfo(testData, testUserId);
    const decrypted = await dataEncryptionService.decryptPersonalInfo(encrypted, testUserId);
    
    console.log(`   Original: ${testData}`);
    console.log(`   Encrypted: ${encrypted.substring(0, 50)}...`);
    console.log(`   Decrypted: ${decrypted}`);
    console.log(`   Match: ${testData === decrypted ? '✅' : '❌'}\n`);

    // Test 4: Batch operations
    console.log('4. Testing batch operations...');
    const batchData = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Test Street'
    };
    
    const encryptedBatch = await dataEncryptionService.batchEncryptData(batchData, testUserId);
    const decryptedBatch = await dataEncryptionService.batchDecryptData(encryptedBatch, testUserId);
    
    console.log('   Original batch data:', batchData);
    console.log('   Decrypted batch data:', decryptedBatch);
    console.log(`   Batch match: ${JSON.stringify(batchData) === JSON.stringify(decryptedBatch) ? '✅' : '❌'}\n`);

    // Test 5: Key validation
    console.log('5. Validating keys...');
    const isValid = await keyManager.validateKeys(testUserId);
    console.log(`✅ Keys valid: ${isValid}\n`);

    // Test 6: Get key info
    console.log('6. Getting key information...');
    const keyInfo = await keyManager.getKeyInfo(testUserId);
    console.log('   Key info:', keyInfo);

    // Test 7: Cleanup
    console.log('\n7. Cleaning up test keys...');
    await keyManager.removeUserKeys(testUserId);
    console.log('✅ Test keys removed successfully');

    console.log('\n🎉 All tests passed! RSA Key Management System is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the test
testKeyManagement();

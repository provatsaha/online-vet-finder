# 🔐 Key Management Module

A comprehensive RSA-based encryption system for the Online Vet Finder application. Each user and vet has their own public and private key pair stored securely in MongoDB.

## 🏗️ Architecture

### Core Components

1. **cryptoUtils.ts** - Core cryptographic functions (RSA key generation, encryption, decryption)
2. **keyManager.ts** - Key management service for users and vets
3. **dataEncryptionService.ts** - Service for encrypting/decrypting specific data types
4. **encryptionMiddleware.ts** - Express middleware for automatic encryption/decryption
5. **keyValidationUtils.ts** - Utilities for testing and validating keys
6. **index.ts** - Main export file for easy access to all utilities
7. **RSAKey.ts** - MongoDB model for storing RSA keys

### Key Features

- ✅ **Individual RSA keys** for each user/vet (no master keys)
- ✅ **MongoDB storage** for secure key persistence
- ✅ **Automatic encryption/decryption** via middleware
- ✅ **Comprehensive key validation** and testing
- ✅ **Batch operations** for multiple data fields
- ✅ **Type-safe** TypeScript implementation
- ✅ **Error handling** with detailed logging
- ✅ **Async/await** support for all operations

## 🚀 Quick Start

### 1. Basic Usage

```typescript
import { keyManager, dataEncryptionService } from "./utils";

// Initialize keys for new user
const keys = await keyManager.initializeUserKeys("user123");

// Encrypt sensitive data
const encryptedData = await dataEncryptionService.encryptPersonalInfo(
  "John Doe",
  "user123"
);

// Decrypt data
const decryptedData = await dataEncryptionService.decryptPersonalInfo(
  encryptedData,
  "user123"
);
```

### 2. Using Middleware

```typescript
import {
  encryptUserProfileMiddleware,
  decryptUserProfileMiddleware,
} from "./utils";

// Apply encryption middleware to routes
app.post(
  "/api/profile",
  decryptUserProfileMiddleware(), // Decrypt incoming data
  createProfile,
  encryptUserProfileMiddleware() // Encrypt outgoing data
);
```

### 3. Batch Operations

```typescript
import { batchEncryptData, batchDecryptData } from "./utils";

const userData = {
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St",
  phone: "+1234567890",
};

// Encrypt all fields at once
const encryptedData = await batchEncryptData(userData, "user123");

// Decrypt all fields at once
const decryptedData = await batchDecryptData(encryptedData, "user123");
```

## 📚 API Reference

### Key Manager

#### `keyManager.initializeUserKeys(userId: string, keySize?: number)`

Generates RSA key pair for a new user/vet and stores in MongoDB.

```typescript
const keys = await keyManager.initializeUserKeys("user123", 2048);
// Returns: { publicKey: string, privateKey: string }
```

#### `keyManager.encryptData(data: string, userId: string)`

Encrypts data using user's public key.

```typescript
const encrypted = await keyManager.encryptData("sensitive data", "user123");
```

#### `keyManager.decryptData(encryptedData: string, userId: string)`

Decrypts data using user's private key.

```typescript
const decrypted = await keyManager.decryptData(encrypted, "user123");
```

#### `keyManager.hasValidKeys(userId: string)`

Checks if user has valid encryption keys in MongoDB.

```typescript
const hasKeys = await keyManager.hasValidKeys("user123"); // boolean
```

### Data Encryption Service

#### Personal Information

```typescript
// Encrypt/decrypt personal info
const encrypted = await dataEncryptionService.encryptPersonalInfo(
  "John Doe",
  "user123"
);
const decrypted = await dataEncryptionService.decryptPersonalInfo(
  encrypted,
  "user123"
);
```

#### Appointment Data

```typescript
// Encrypt/decrypt appointment details
const encrypted = await dataEncryptionService.encryptAppointmentData(
  "symptoms",
  "user123"
);
const decrypted = await dataEncryptionService.decryptAppointmentData(
  encrypted,
  "user123"
);
```

#### Pet Data

```typescript
// Encrypt/decrypt pet information
const encrypted = await dataEncryptionService.encryptPetData(
  "medical history",
  "user123"
);
const decrypted = await dataEncryptionService.decryptPetData(
  encrypted,
  "user123"
);
```

#### Payment Data

```typescript
// Encrypt/decrypt payment information
const encrypted = await dataEncryptionService.encryptPaymentData(
  "card number",
  "user123"
);
const decrypted = await dataEncryptionService.decryptPaymentData(
  encrypted,
  "user123"
);
```

### Middleware

#### User Profile Encryption

```typescript
import {
  encryptUserProfileMiddleware,
  decryptUserProfileMiddleware,
} from "./utils";

app.use("/api/profile", decryptUserProfileMiddleware()); // Decrypt incoming
app.use("/api/profile", encryptUserProfileMiddleware()); // Encrypt outgoing
```

#### Custom Field Encryption

```typescript
import { createEncryptionMiddleware } from "./utils";

const customEncryption = createEncryptionMiddleware([
  "customField1",
  "customField2",
]);

app.use("/api/custom", customEncryption.decrypt); // Decrypt incoming
app.use("/api/custom", customEncryption.encrypt); // Encrypt outgoing
```

### Validation Utilities

#### Test User Encryption

```typescript
import { testUserEncryption } from "./utils";

const result = await testUserEncryption("user123");
console.log(result.success); // boolean
console.log(result.message); // string
```

#### System Health Check

```typescript
import { performHealthCheck } from "./utils";

const health = await performHealthCheck();
console.log(health.overallHealth); // 'healthy' | 'warning' | 'critical'
console.log(health.summary); // string
```

## 🔧 Configuration

### MongoDB Storage

Keys are stored in the `rsakeys` collection in MongoDB:

- `userId` - Unique identifier for the user/vet
- `publicKey` - RSA public key in PEM format
- `privateKey` - RSA private key in PEM format
- `keySize` - RSA key size (default: 2048)
- `createdAt` - Timestamp when keys were created
- `updatedAt` - Timestamp when keys were last updated

### Key Sizes

- Default: 2048 bits
- Supported: 1024, 2048, 4096 bits

## 🛡️ Security Features

### Data Protection

- **RSA-2048 encryption** for all sensitive data
- **Individual keys** per user/vet
- **No master keys** - complete isolation
- **MongoDB storage** with proper indexing
- **Automatic encryption** via middleware

### Key Management

- **Secure key generation** using Node.js crypto
- **MongoDB persistence** for scalability
- **Key validation** and testing
- **Backup and restore** capabilities
- **Automatic cleanup** for deleted accounts

## 📝 Usage Examples

### 1. User Registration with Key Generation

```typescript
import { keyManager, dataEncryptionService } from "./utils";

async function registerUser(userData: any) {
  try {
    // Create user in database
    const user = await User.create(userData);

    // Generate encryption keys
    const keys = await keyManager.initializeUserKeys(user._id.toString());

    // Encrypt sensitive data
    const encryptedData = {
      firstName: await dataEncryptionService.encryptPersonalInfo(
        userData.firstName,
        user._id.toString()
      ),
      lastName: await dataEncryptionService.encryptPersonalInfo(
        userData.lastName,
        user._id.toString()
      ),
      address: await dataEncryptionService.encryptPersonalInfo(
        userData.address,
        user._id.toString()
      ),
    };

    // Update user with encrypted data
    await User.findByIdAndUpdate(user._id, encryptedData);

    return { success: true, userId: user._id };
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
```

### 2. Protected API Route

```typescript
import {
  encryptUserProfileMiddleware,
  decryptUserProfileMiddleware,
} from "./utils";

app.get(
  "/api/profile/:userId",
  decryptUserProfileMiddleware(),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

app.post("/api/profile", decryptUserProfileMiddleware(), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});
```

### 3. Batch Data Processing

```typescript
import { batchEncryptData, batchDecryptData } from "./utils";

// Encrypt multiple user records
async function encryptUserBatch(users: any[]) {
  const encryptedUsers = [];
  for (const user of users) {
    const encrypted = await batchEncryptData(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      },
      user._id.toString()
    );

    encryptedUsers.push({
      ...user,
      ...encrypted,
    });
  }
  return encryptedUsers;
}

// Decrypt multiple user records
async function decryptUserBatch(encryptedUsers: any[]) {
  const decryptedUsers = [];
  for (const user of encryptedUsers) {
    const decrypted = await batchDecryptData(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      },
      user._id.toString()
    );

    decryptedUsers.push({
      ...user,
      ...decrypted,
    });
  }
  return decryptedUsers;
}
```

## 🧪 Testing

### Test Key Generation

```typescript
import { generateTestKeys, cleanupTestKeys } from "./utils";

// Generate test keys
const result = await generateTestKeys("testUser123");
console.log(result.success); // true/false

// Clean up test keys
const cleanup = await cleanupTestKeys("testUser123");
console.log(cleanup.success); // true/false
```

### Validate All Keys

```typescript
import { validateAllKeys } from "./utils";

const validation = await validateAllKeys();
console.log(`Total users: ${validation.totalUsers}`);
console.log(`Valid keys: ${validation.validKeys}`);
console.log(`Invalid keys: ${validation.invalidKeys}`);
```

### Run Test Script

```bash
# Test the key management system
node test-keys.js
```

## 🚨 Error Handling

### Common Errors

1. **Keys not found**

   ```typescript
   try {
     const decrypted = await dataEncryptionService.decryptPersonalInfo(
       encrypted,
       "user123"
     );
   } catch (error) {
     if (error.message.includes("Public key not found")) {
       // Handle missing keys
     }
   }
   ```

2. **Invalid keys**

   ```typescript
   try {
     const isValid = await keyManager.validateKeys("user123");
   } catch (error) {
     // Handle invalid keys
   }
   ```

3. **Encryption/decryption failures**
   ```typescript
   try {
     const encrypted = await dataEncryptionService.encryptPersonalInfo(
       data,
       "user123"
     );
   } catch (error) {
     // Handle encryption failure
   }
   ```

## 🔄 Migration

### From Plain Text to Encrypted

```typescript
import { keyManager, dataEncryptionService } from "./utils";

async function migrateUserData(userId: string) {
  try {
    // Generate keys if they don't exist
    if (!(await keyManager.hasValidKeys(userId))) {
      await keyManager.initializeUserKeys(userId);
    }

    // Get user data
    const user = await User.findById(userId);

    // Encrypt sensitive fields
    const encryptedData = {
      firstName: await dataEncryptionService.encryptPersonalInfo(
        user.firstName,
        userId
      ),
      lastName: await dataEncryptionService.encryptPersonalInfo(
        user.lastName,
        userId
      ),
      address: await dataEncryptionService.encryptPersonalInfo(
        user.address,
        userId
      ),
    };

    // Update user with encrypted data
    await User.findByIdAndUpdate(userId, encryptedData);

    return { success: true };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
```

## 📊 Performance Considerations

### MongoDB Indexing

The RSAKey model includes proper indexes for optimal performance:

- `userId` index for fast key lookups
- Compound index on `userId` and `createdAt` for time-based queries

### Async Operations

All encryption/decryption operations are asynchronous to prevent blocking:

- Use `await` when calling encryption functions
- Handle errors appropriately in async contexts

### Batch Operations

Use batch encryption/decryption functions for multiple fields to reduce database calls.

## 🔒 Security Best Practices

1. **Never store private keys** in plain text
2. **Use HTTPS** for all API communications
3. **Implement proper authentication** before encryption/decryption
4. **Regular key rotation** for high-security applications
5. **Monitor encryption/decryption** operations for anomalies
6. **Secure MongoDB access** with proper authentication and network security
7. **Backup MongoDB** regularly for disaster recovery

## 🆘 Troubleshooting

### Common Issues

1. **"Keys not found" error**

   - Ensure user has registered and keys were generated
   - Check MongoDB connection and RSAKey collection
   - Verify user ID format and consistency

2. **"Encryption failed" error**

   - Verify public key format is correct
   - Check if data size exceeds RSA limits
   - Ensure MongoDB is accessible

3. **"Decryption failed" error**

   - Verify private key format is correct
   - Check if encrypted data is corrupted
   - Ensure user has valid keys in database

4. **Middleware not working**
   - Ensure middleware is applied after authentication
   - Check if `req.user.id` is available
   - Verify async/await usage in middleware

### Debug Mode

```typescript
import { getComprehensiveKeyInfo } from "./utils";

const keyInfo = await getComprehensiveKeyInfo("user123");
console.log("Key Status:", keyInfo);
console.log("Recommendations:", keyInfo.recommendations);
```

### MongoDB Queries

```typescript
// Check all RSA keys in the system
const allKeys = await RSAKey.find({});
console.log("Total keys:", allKeys.length);

// Check specific user's keys
const userKeys = await RSAKey.findOne({ userId: "user123" });
console.log("User keys exist:", !!userKeys);
```

## 📞 Support

For issues or questions about the key management module:

1. Check the validation utilities for diagnostics
2. Review error logs for specific error messages
3. Test with the provided validation functions
4. Ensure MongoDB is running and accessible
5. Verify database permissions and indexes

---

**Note**: This module provides enterprise-grade encryption security with MongoDB persistence. Always test thoroughly in development before deploying to production.

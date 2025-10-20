# 🔐 Security Setup Guide - RSA + AES Encryption

## Overview

This application now uses **double-layer encryption** for maximum security:

1. **RSA Encryption** - For user data (names, addresses, notes, symptoms, payment info)
2. **AES Encryption** - For protecting RSA private keys

## 🛡️ Security Architecture

### Before (Vulnerable):

```
RSA Private Keys → Stored in plain text → Anyone with file access can decrypt all data
```

### After (Secure):

```
RSA Private Keys → Encrypted with AES Master Key → Only you can access private keys
```

## 🚀 Setup Instructions

### Step 1: Run Migration Script

```bash
cd backend
node migrate_keys_to_aes.js
```

This will:

- Generate a master AES key (256-bit)
- Encrypt all existing RSA private keys
- Create backups of original keys
- Test the encryption/decryption

### Step 2: Secure Your Master Key

The master key is saved to `backend/master_key.txt`

**⚠️ CRITICAL SECURITY STEPS:**

1. **Backup this file** to a secure location (not in your project)
2. **Delete it** from the project directory after migration
3. **Store it securely** - this key decrypts ALL private keys
4. **Never commit it** to version control

### Step 3: Test the System

1. Start your server: `npm run dev`
2. Test user login/registration
3. Test appointment creation
4. Test payment processing
5. Verify all encrypted data works

### Step 4: Clean Up (After Testing)

```bash
# Remove backup files (only after confirming everything works)
find backend/rsa_keys -name "*.backup" -delete

# Remove master key from project (keep your secure backup)
rm backend/master_key.txt
```

## 🔑 How It Works

### Key Generation (New Users):

1. User signs up
2. RSA key pair generated
3. Public key stored in plain text
4. Private key encrypted with AES master key
5. Encrypted private key stored

### Data Encryption:

1. User data encrypted with their RSA public key
2. Data stored encrypted in database
3. When needed, private key decrypted with AES master key
4. Data decrypted with decrypted private key

### Security Benefits:

- ✅ **Database administrators** cannot access private keys
- ✅ **File system access** cannot decrypt private keys
- ✅ **All functionality preserved** - transparent to users
- ✅ **Double encryption** - RSA for data + AES for keys

## 🚨 Important Notes

### Master Key Security:

- **Keep it secure** - this is your master password
- **Backup safely** - losing it means losing access to all encrypted data
- **Don't share** - anyone with this key can decrypt all private keys

### Migration Safety:

- Original keys are backed up with `.backup` extension
- Test thoroughly before deleting backups
- Migration is reversible (restore from backups if needed)

### Production Deployment:

- Store master key in environment variables
- Use secure key management services (AWS KMS, Azure Key Vault, etc.)
- Never hardcode the master key

## 🔍 Troubleshooting

### If Migration Fails:

1. Check file permissions on `rsa_keys` directory
2. Ensure you have write access to create `master_key.txt`
3. Check console for specific error messages

### If Decryption Fails:

1. Verify master key is correct
2. Check if private key files are properly encrypted
3. Restore from backup files if needed

### If Functionality Breaks:

1. Check server logs for key initialization errors
2. Verify `initializeMasterKey()` is called on server start
3. Test with a new user account

## 📊 Security Comparison

| Aspect                | Before               | After                       |
| --------------------- | -------------------- | --------------------------- |
| Private Key Storage   | Plain text           | AES encrypted               |
| Database Admin Access | Can decrypt all data | Cannot access private keys  |
| File System Security  | Vulnerable           | Protected                   |
| Key Management        | Individual files     | Centralized with master key |
| Migration Effort      | None                 | One-time setup              |

## 🎯 Next Steps

1. **Run the migration script**
2. **Test all functionality**
3. **Secure your master key**
4. **Deploy with confidence**

Your application now has **enterprise-grade security** while maintaining all existing functionality! 🚀🔒

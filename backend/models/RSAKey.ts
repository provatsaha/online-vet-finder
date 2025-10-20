import mongoose, { Schema, Document } from 'mongoose';

export interface IRSAKey extends Document {
  userId: string;
  publicKey: string;
  privateKey: string;
  keySize: number;
  createdAt: Date;
  updatedAt: Date;
}

const RSAKeySchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  keySize: {
    type: Number,
    required: true,
    default: 2048
  }
}, {
  timestamps: true
});

// Create compound index for better query performance
RSAKeySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IRSAKey>('RSAKey', RSAKeySchema);

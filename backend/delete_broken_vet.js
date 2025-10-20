// This script will delete a broken vet and its associated user from MongoDB Atlas.
// 1. Replace <your-atlas-connection-string> with your real connection string.
// 2. Replace <vetId> and <userId> with the actual IDs (see below).
// 3. Run with: node delete_broken_vet.js

const { MongoClient, ObjectId } = require('mongodb');

const uri = mongodb+srv://taeebatasnia2001:baRDYAVXaQucvNTE@onlinevet.ck2hqfx.mongodb.net/?retryWrites=true&w=majority&appName=onlineVet;
const vetId = "68b4c7826af6dabe178b3bb9"; // The broken vet
const userId = "<userId-from-vet-document>"; // Fill this in after step 1

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    // 1. Find the vet and get the userId
    const vet = await db.collection('vets').findOne({ _id: ObjectId(vetId) });
    if (!vet) {
      console.log('Vet not found');
      return;
    }
    console.log('Vet:', vet);
    // 2. Delete the vet
    await db.collection('vets').deleteOne({ _id: ObjectId(vetId) });
    console.log('Deleted vet');
    // 3. Delete the user
    if (vet.user) {
      await db.collection('users').deleteOne({ _id: ObjectId(vet.user) });
      console.log('Deleted user:', vet.user);
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);

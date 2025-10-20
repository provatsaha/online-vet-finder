// This script will delete ALL vets and their associated users from MongoDB Atlas.
// 1. Replace <your-atlas-connection-string> with your real connection string.
// 2. Run with: node delete_all_vets.js

const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://taeebatasnia2001:baRDYAVXaQucvNTE@onlinevet.ck2hqfx.mongodb.net/?retryWrites=true&w=majority&appName=onlineVet";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    // 1. Find all vets
    const vets = await db.collection('vets').find({}).toArray();
    if (!vets.length) {
      console.log('No vets found');
      return;
    }
    // 2. Delete all vets
    const vetIds = vets.map(vet => vet._id);
    await db.collection('vets').deleteMany({});
    console.log('Deleted all vets');
    // 3. Delete all associated users
    const userIds = vets.map(vet => vet.user).filter(Boolean);
    if (userIds.length) {
      await db.collection('users').deleteMany({ _id: { $in: userIds.map(id => ObjectId(id)) } });
      console.log('Deleted all associated users');
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);

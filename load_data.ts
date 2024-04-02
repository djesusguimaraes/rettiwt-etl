import { MongoClient, OptionalUnlessRequiredId } from "mongodb";
import { Document } from "mongoose";

const client = new MongoClient("mongodb://mongo-tcc:27017/");

export const loadData = async (
  data:OptionalUnlessRequiredId<Document>[],
  collectionName: string
) => {
  try {
    await client.connect();

    const db = client.db('tweets');
    const collection = db.collection(collectionName);

    const response = await collection.insertMany(data);

    return response.insertedCount;
  } catch (error) {
    console.error("Error Connecting MongoDB", error);
  }

  await client.close();
};

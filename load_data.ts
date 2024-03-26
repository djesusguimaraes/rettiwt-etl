import { MongoClient, OptionalUnlessRequiredId } from "mongodb";
import { Document } from "mongoose";

const client = new MongoClient("mongodb://mongo-tcc:27017/");

export const loadData = async (
  data:OptionalUnlessRequiredId<Document>[],
  collectionName: string
) => {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully.");

    const db = client.db('tweets');
    const collection = db.collection(collectionName);

    const response = await collection.insertMany(data);
    console.log(
      `${response.insertedCount} CSV Data Successfully loaded to MongoDB.`
    );
  } catch (error) {
    console.error("Error Connecting MongoDB", error);
  }

  await client.close();
};

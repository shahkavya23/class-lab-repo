import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("URI:", process.env.dbURL ? "Found URI" : "Missing URI");

async function test() {
  try {
    console.log("Attempting connect with options...");
    await mongoose.connect(process.env.dbURL, {
      dbName: "shopkart",
      serverSelectionTimeoutMS: 30000,
    });
    console.log("SUCCESSFULLY CONNECTED TO MONGODB!");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Connect failed:", err);
    process.exit(1);
  }
}

test();

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/products.model.js";
import { mockProducts } from "./data/products.data.js";

dotenv.config();

export async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.dbURL);
    console.log("Connected to MongoDB successfully!");

    const count = await Product.countDocuments();
    console.log(`Current product count in database: ${count}`);

    if (count > 0) {
      console.log("Refreshing existing products with latest 20 items catalog...");
      await Product.deleteMany({});
    }

    // Format products for insertion (without custom _id string if mongoose generates objectId or keep if valid)
    const formatted = mockProducts.map(p => ({
      name: p.name,
      description: p.description,
      category: p.category,
      image: p.image,
      price: p.price,
      stock: p.stock
    }));

    const inserted = await Product.insertMany(formatted);
    console.log(`Successfully added ${inserted.length} high-quality products to MongoDB!`);

    await mongoose.connection.close();
    console.log("Database connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error.message);
    if (error.message.includes("whitelist")) {
      console.log("\nTIP: Please whitelist your IP in MongoDB Atlas (Network Access -> Add IP Address 0.0.0.0/0).");
    }
    process.exit(1);
  }
}

seedDatabase();

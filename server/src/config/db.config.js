import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (process.env.USE_IN_MEMORY_DB === "true") {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
      console.log("Using in-memory MongoDB for development");
    }

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

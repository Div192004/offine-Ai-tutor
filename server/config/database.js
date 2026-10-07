import mongoose from "mongoose";

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.warn(
      "MONGODB_URI is not set. Running with temporary in-memory quiz and progress data.",
    );
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB.");
    return true;
  } catch (error) {
    console.error("Could not connect to MongoDB. The API will not start.", error);
    throw error;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

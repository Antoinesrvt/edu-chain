// lib/db/mongodb.ts
import mongoose, { Model } from "mongoose";
import { ITechItem } from "~/app/types/server";

mongoose.set("debug", true);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}


async function dbConnect() {
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB...", MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Database connection established");
  } catch (e) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}


const ScriptActionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["install", "addFile", "executeCommand"],
    required: true,
  },
  payload: {
    type: String,
    required: true,
  },
});

const ProjectFileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const TechItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["frameworkJS", "frameworkCSS", "headless", "componentLib", "plugin"],
    required: true,
  },
  actions: [ScriptActionSchema],
  files: [ProjectFileSchema],
}, { collection: 'techItems' });

export const TechItem: Model<ITechItem> =
  mongoose.models.TechItem ||
  mongoose.model<ITechItem>("TechItem", TechItemSchema);

export default dbConnect;

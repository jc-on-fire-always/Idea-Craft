import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

// Interface for Mongoose connection
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend globalThis to include the mongoose property
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Type-safe `cached` initialization
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached; // Attach to global object
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error('Missing MONGODB_URL');
  }

  // Initialize the connection promise if not already set
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'idea-craft',
      bufferCommands: false,
    });

  // Await the promise to resolve the connection
  cached.conn = await cached.promise;
  return cached.conn;
};

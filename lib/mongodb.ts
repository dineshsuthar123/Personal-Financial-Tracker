import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
    };

    try {
      console.log('Connecting to MongoDB...');
      global.mongoose.promise = mongoose.connect(MONGODB_URI as string, opts as mongoose.ConnectOptions);
      console.log('MongoDB connection initiated');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      global.mongoose.promise = null;
      throw error;
    }
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    global.mongoose.promise = null;
    console.error('Error establishing MongoDB connection:', e);
    throw e;
  }

  return global.mongoose.conn;
}

export default connectDB; 
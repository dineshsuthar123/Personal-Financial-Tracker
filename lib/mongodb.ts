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
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true,
    };

    try {
      console.log('Connecting to MongoDB...');
      console.log('MongoDB URI:', MONGODB_URI?.substring(0, 20) + '...');
      
      cached.promise = mongoose.connect(MONGODB_URI as string, opts as mongoose.ConnectOptions);
      console.log('MongoDB connection initiated');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    cached.promise = null;
    console.error('Error establishing MongoDB connection:', e);
    if (e instanceof Error) {
      console.error('Error name:', e.name);
      console.error('Error message:', e.message);
      console.error('Error stack:', e.stack);
    }
    throw e;
  }

  return cached.conn;
}

export default connectDB; 
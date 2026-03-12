import mongoose, { ConnectOptions } from "mongoose";

// Reuse a single cached connection across hot-reloads in development.
// In production this global cache is ignored because the module is loaded only once.
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
    _mongoose?: MongooseCache;
};

const cached: MongooseCache =
    globalForMongoose._mongoose ?? (globalForMongoose._mongoose = { conn: null, promise: null });

const MONGODB_URI = process.env.MONGODB_URI;

const options: ConnectOptions = {
    bufferCommands: false, // Let Mongoose surface errors instead of queuing operations when disconnected.
};

/**
 * Establishes (or reuses) a single Mongoose connection.
 * Call this at the start of each request that touches the database.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not set");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, options);
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        // Clear cached promise/conn so future calls can retry after a failure.
        cached.promise = null;
        cached.conn = null;
        throw error;
    }
}

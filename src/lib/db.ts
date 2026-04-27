import mongoose from "mongoose";

// This flag tracks whether we already have an active DB connection.
// We use a module-level variable so it persists across hot reloads in dev.
let isConnected = false;

/**
 * Connects to MongoDB using the URI stored in the MONGODB_URI environment variable.
 *
 * We guard with `isConnected` so we only create ONE connection per server
 * process — calling this function multiple times is safe (idempotent).
 */
export const connectDB = async () => {
  // Skip reconnecting if a connection already exists
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);

    // readyState === 1 means "connected"; store that as a boolean
    isConnected = !!conn.connections[0].readyState;
  } catch (error) {
    // Rethrow a clean error so callers receive a meaningful message
    throw new Error("Database connection failed");
  }
};
import mongoose from "mongoose";

let cached = global.__mongoose_cached;
if (!cached) {
  cached = global.__mongoose_cached = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas (recommended for Vercel).
 * Uses connection caching so it works well in serverless environments.
 */
export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || undefined,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export const MemeModel =
  mongoose.models.Meme ||
  mongoose.model(
    "Meme",
    new mongoose.Schema(
      {
        title: { type: String, required: true },
        src: { type: String, required: true }, // should be a public URL or a path like "/date1.jpeg"
        createdAt: { type: Date, default: Date.now },
      },
      { versionKey: false }
    )
  );

/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, {Mongoose} from "mongoose";

const url = process.env.MONGODB_URI!

interface Cached {
  conn: Mongoose | null,
  promise: Promise<Mongoose> | null
}

let cached: Cached = (global as any).mongoose
if (!cached) {
  cached = (global as any).moongoose = { conn: null, promise: null}
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(url).then((mongoose) => {return mongoose});
  }
  cached.conn = await cached.promise
  return cached.conn
}

mongoose.connect(url).then(() => console.log("MongoDB connected.")).catch((error) => console.log(error));

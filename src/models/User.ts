import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface for the User document stored in MongoDB.
 * Extending `Document` gives us access to Mongoose methods like `.save()`.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Always stored as a bcrypt hash — never plain text
}

/**
 * Mongoose schema that defines the shape and rules of the users collection.
 *
 * - `email` is unique so two accounts can't share the same address.
 * - `{ timestamps: true }` automatically adds `createdAt` and `updatedAt` fields.
 */
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Export the User model.
 *
 * The `mongoose.models.User` check prevents Next.js from re-registering
 * the model on every hot reload during development (Mongoose throws an
 * error if you try to compile the same model twice).
 */
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
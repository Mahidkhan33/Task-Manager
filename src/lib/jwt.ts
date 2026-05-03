import jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  email: string;
}

export const signToken = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};
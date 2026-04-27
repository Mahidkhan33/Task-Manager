import jwt from "jsonwebtoken";

/**
 * Signs a JWT with the given payload.
 *
 * The secret key comes from the JWT_SECRET environment variable.
 * The token expires in 7 days — after that the user must log in again.
 *
 * @param payload - An object to embed inside the token (e.g. { userId })
 * @returns A signed JWT string
 */
export const signToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

/**
 * Verifies a JWT and returns its decoded payload.
 *
 * Throws a JsonWebTokenError if the token is invalid or expired —
 * callers should catch that and return a 401 response.
 *
 * @param token - The JWT string to verify
 * @returns The decoded payload object
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
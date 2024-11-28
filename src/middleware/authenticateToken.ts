import { NextFunction, Response } from "express";
import { access_token_key, CustomRequest } from "../auth/index.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../index.js";

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}
export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  jwt.verify(token, access_token_key, async (error, user) => {
    if (error) return res.status(401).json({ message: "Invalid Token" });
    if (user && typeof user === "object") {
      req.user = user as CustomJwtPayload;
    }

    next();
  });
}

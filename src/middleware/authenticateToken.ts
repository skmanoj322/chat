import { NextFunction, Response } from "express";
import { access_token_key, CustomRequest } from "../auth/index.js";
import jwt from "jsonwebtoken";

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
  jwt.verify(token, access_token_key, (error, user) => {
    if (error) return res.status(401).json({ message: "Invalid Token" });

    req.user = user;
    next();
  });
}

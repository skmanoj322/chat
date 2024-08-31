import { Router } from "express";
import { prisma } from "..";
import { error } from "console";
export const userMessage = Router();

userMessage.get("", async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
});

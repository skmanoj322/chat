import { error } from "console";
import { Router } from "express";
import { prisma } from "..";

export const usergetAllMessage = Router();

usergetAllMessage.get("/", async (req, res) => {});

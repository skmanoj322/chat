import { Request, Router } from "express";
import { prisma } from "..";
import { IncomingReq } from "../types";

export const addUser = Router();

addUser.post("", async (req: Request<{}, {}, IncomingReq>, res) => {
  const { username } = req.body;
  console.log(req.body);
  try {
    const createdUser = await prisma.user.create({
      data: {
        username: username,
      },
    });
    res.json(createdUser);
  } catch (error) {
    console.log("error");
  }
});

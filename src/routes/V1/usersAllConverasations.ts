import { Router } from "express";
import { prisma } from "../../index.js";
import { CustomRequest } from "../../auth/index.js";
import { CustomJwtPayload } from "../../middleware/authenticateToken.js";
export const allConversation = Router();

allConversation.get("/", async (req: CustomRequest, res) => {
  const { id } = req.user as CustomJwtPayload;

  if (id === undefined) {
    return res.send({
      id: "Invalid user",
    });
  }
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: id,
          },
        },
      },
      select: {
        participants: {
          where: {
            userId: {
              not: id,
            },
          },
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                dp: true,
              },
            },
          },
        },
        lastMessage: {
          select: {
            messageText: true,
            sender: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            createdAt: true,
            readStatus: true,
          },
        },
        isPrivate: true,
        name: true,
      },
    });
    return res.send(conversations);
  } catch (error) {
    return res.send({ Error: error });
  }
});

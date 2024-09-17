import { Router } from "express";
import { prisma } from "../../index.js";
export const newConversation = Router();
newConversation.post("", async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const currentUser = urlObj.searchParams.get("userId") as string;
  const { connectTo } = req.body;
  const currentUserExists = await prisma.user.findUnique({
    where: {
      id: currentUser,
    },
  });
  const connectToUserExists = await prisma.user.findUnique({
    where: {
      id: connectTo,
    },
  });
  if (!connectToUserExists || !currentUserExists) {
    return res.status(400).send({
      messsage: "User doesnt exists",
    });
  }

  const conversationExists = await prisma.conversation.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              userId: connectTo,
            },
          },
        },
        {
          participants: {
            some: {
              userId: currentUser,
            },
          },
        },
      ],
    },
    include: {
      participants: true,
    },
  });
  if (!conversationExists) {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          isPrivate: true,
          participants: {
            create: [
              {
                userId: connectTo,
              },
              {
                userId: currentUser,
              },
            ],
          },
        },
        include: {
          participants: true,
        },
      });
      // git testing
      return res.send({
        message: "conversation ssucessfully created",
        conversation: conversation,
      });
    } catch (error) {
      console.log(error);
    }
  }
  res.send({ connectTo, currentUser, conversationExists });
});

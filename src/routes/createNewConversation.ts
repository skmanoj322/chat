import { Router } from "express";
import { prisma } from "..";

export const newConversation = Router();

newConversation.post("/", async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const currentUser = urlObj.searchParams.get("userId");
  const { connectTo } = req.body;

  //   FOR Dms

  console.log(connectTo);

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

    return res.send({
      message: "conversation ssucessfully created",
      conversation: conversation,
    });
  }
  console.log("CONVERSATION EXISTS");
  res.send({ connectTo, currentUser, conversationExists });
});

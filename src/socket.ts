import { Request } from "express";
import { manager, prisma, wss } from ".";
import { participants } from "./types";
import { WebSocket } from "ws";

export const socketHandler = async (ws: WebSocket, req: Request) => {
  const urlObj = new URL(req.url, `ws://${req.headers.host}`);
  const userId = urlObj.searchParams.get("userId") as string;
  const conversationId = urlObj.searchParams.get("consversationId");
  let conversation: { participants: participants } | null = null;
  if (userId && conversationId) {
    manager.addSubscription(userId, ws);
    try {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        select: {
          participants: {},
        },
      });
    } catch (error) {
      console.log("Error", error);
    }
  }
  const sendUsersMessages = conversation?.participants.map(
    (user) => user.userId
  );
  ws.on("message", async (message) => {
    const msg = manager.parsedMessage(message);
    const { textMessage } = msg;
    const activeUser = sendUsersMessages?.filter(
      (user) => manager.getSubscription(user) !== undefined
    );
    activeUser?.forEach((user) => {
      if (userId !== user) {
        manager.emit(manager.getSubscription(user).ws, textMessage);
      }
    });
    if (conversationId) {
      const storeMessage = await prisma.message.create({
        data: {
          senderId: userId,
          conversationId: conversationId,
          readStatus: "SENT",
          messageText: textMessage,
        },
      });
      await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessageId: storeMessage.id,
        },
      });
    }
  });
};

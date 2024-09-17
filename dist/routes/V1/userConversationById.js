import { Router } from "express";
import { prisma } from "../../index.js";
export const conversationById = Router();
conversationById.get("", async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    // res.send({ urlObj });
    const conversationId = urlObj.searchParams.get("conversationId");
    const allMessagesInConversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
    return res.send({
        conversation: allMessagesInConversation,
    });
});

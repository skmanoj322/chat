import { Router } from "express";
import { prisma } from "../../index.js";
export const allConversation = Router();
allConversation.get("/", async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const me = urlObj.searchParams.get("me");
    try {
        const conversations = await prisma.conversationPartcipant.findMany({
            where: {
                userId: me,
            },
            include: {
                conversation: {
                    include: {
                        messages: {
                            take: 1,
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                },
            },
        });
        return res.send(conversations);
    }
    catch (error) {
        return res.send({ Error: error });
    }
});

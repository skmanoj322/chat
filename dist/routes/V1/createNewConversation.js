import { Router } from "express";
import { prisma } from "../../index.js";
export const newConversation = Router();
newConversation.post("", async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const currentUser = req.user;
    let conversationExists;
    const { connectTo } = req.body;
    console.log(connectTo, currentUser);
    try {
        conversationExists = await prisma.conversation.findFirst({
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
                                // @ts-ignore
                                userId: currentUser?.user,
                            },
                        },
                    },
                ],
            },
            include: {
                participants: true,
            },
        });
    }
    catch (error) {
        return res.send({ message: "ERROR 404", error: error });
    }
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
                                // @ts-ignore
                                userId: currentUser?.user,
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
        catch (error) {
            console.log(error);
        }
    }
    res.send({ connectTo, currentUser, conversationExists });
});

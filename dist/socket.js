import { manager, prisma } from "./index.js";
export const socketHandler = async (ws, req) => {
    const urlObj = new URL(req.url, `ws://${req.headers.host}`);
    const userId = urlObj.searchParams.get("userId");
    const conversationId = urlObj.searchParams.get("consversationId");
    let conversation = null;
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
        }
        catch (error) {
            console.log("Error", error);
        }
    }
    const sendUsersMessages = conversation?.participants.map((user) => user.userId);
    ws.on("message", async (message) => {
        const msg = manager.parsedMessage(message);
        const { textMessage } = msg;
        const activeUser = sendUsersMessages?.filter((user) => manager.getSubscription(user) !== undefined);
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

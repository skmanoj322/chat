-- CreateTable
CREATE TABLE "ConversationPartcipant" (
    "consversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ConversationPartcipant_pkey" PRIMARY KEY ("consversationId","userId")
);

-- AddForeignKey
ALTER TABLE "ConversationPartcipant" ADD CONSTRAINT "ConversationPartcipant_consversationId_fkey" FOREIGN KEY ("consversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationPartcipant" ADD CONSTRAINT "ConversationPartcipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

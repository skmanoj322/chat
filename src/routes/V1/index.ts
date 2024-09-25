import { Router } from "express";
import { newConversation } from "./createNewConversation.js";
import { conversationById } from "./userConversationById.js";
import { allConversation } from "./usersAllConverasations.js";

export const routerV1 = Router();

routerV1.use("/v1/createNewConversation", newConversation);
routerV1.use("/v1/conversationById", conversationById);
routerV1.use("/v1/allConversations", allConversation);


export * from "./createNewConversation.js";
export * from "./searchUser.js";
export * from "./userConversationById.js";
export * from "./usersAllConverasations.js";

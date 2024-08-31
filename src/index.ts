import express from "express";
import dotenv from "dotenv";
import http from "http";
import { prismaClient } from "./prisma/prismaClient";
import { UserManager } from "./userManager";
import { addUser } from "./routes/addUser";
import { userMessage } from "./routes/userMessage";
import { usergetAllMessage } from "./routes/usersAllMessage";
import { newConversation } from "./routes/createNewConversation";
import { Socket } from "./socketManager";
import { socketHandler } from "./socket";

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT;
export const server = http.createServer(app);
export const prisma = prismaClient.getInstance();
export const wss = Socket.getInstance(server);
export const manager = UserManager.getInstance();
app.use("/chat/v1/addUser", addUser);

app.use("/chat/v1/getMessage", userMessage);
app.use("/chat/v1/getAllMessages", usergetAllMessage);

app.use("/chat/v1/createNewConversation", newConversation);
wss.WebSocketConnect(socketHandler);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

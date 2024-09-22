import express from "express";
import dotenv from "dotenv";
import http from "http";
import { prismaClient } from "./prisma/prismaClient.js";
import { UserManager } from "./userManager.js";

import { Socket } from "./socketManager.js";
import { socketHandler } from "./socket.js";
import { authHandler } from "./auth/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { authenticateToken } from "./middleware/authenticateToken.js";
import { routerV1 } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3001;
export const server = http.createServer(app);
export const prisma = prismaClient.getInstance();
export const wss = Socket.getInstance(server);
export const manager = UserManager.getInstance();

const redirectUri = "http://localhost:3000/auth/callback/google";

app.use("/chat", authenticateToken, routerV1);
app.get("/", (req, res) => {
  res.send("Lol its working! not workin");
});
wss.WebSocketConnect(socketHandler);
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

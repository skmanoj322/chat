import { WebSocket, Server } from "ws";

import { Server as HttpServer } from "http";
import { Request } from "express";

export class Socket {
  private static instance: Socket;

  private wss: Server;

  private constructor(server: HttpServer) {
    this.wss = new WebSocket.Server({ server });
  }

  public static getInstance(server: HttpServer) {
    if (!this.instance) {
      this.instance = new Socket(server);
    }
    return this.instance;
  }

  public WebSocketConnect(socketListiner: (ws: WebSocket, req: Request) => {}) {
    return this.wss.on("connection", socketListiner);
  }
}

import { WebSocketServer } from "ws";
export class Socket {
    static instance;
    wss;
    constructor(server) {
        this.wss = new WebSocketServer({ server });
    }
    static getInstance(server) {
        if (!this.instance) {
            this.instance = new Socket(server);
        }
        return this.instance;
    }
    WebSocketConnect(socketListiner) {
        return this.wss.on("connection", socketListiner);
    }
}

import { WebSocket, Server, RawData } from "ws";
import { server } from "./index";
import http from "http";
import { k } from "vite/dist/node/types.d-aGj9QkWt";
interface Subscription {
  [key: string]: {
    ws: WebSocket;
  };
}
export class UserManager {
  private subscription: Subscription = {};
  private static instance: UserManager;
  private constructor() {}
  static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }
  public addSubscription(key: string, ws: WebSocket) {
    if (!this.subscription[key]) {
      this.subscription[key] = { ws };
    } else {
      this.subscription[key].ws = ws;
    }
    this.registerOnClose(ws, key);
    return this.getSubscription(key);
  }
  public getSubscription(key: string) {
    return this.subscription[key];
  }
  private registerOnClose(ws: WebSocket, id: string) {
    ws.on("close", () => {
      delete this.subscription[id];
    });
  }
  public stringfyMessage(msg: string) {
    return JSON.stringify(msg);
  }
  public parsedMessage(msg: string | any) {
    return JSON.parse(msg);
  }
  public getAllSubscription() {
    return this.subscription;
  }

  public emit(ws: WebSocket, msg: string) {
    return ws.send(JSON.stringify(msg));
  }
}

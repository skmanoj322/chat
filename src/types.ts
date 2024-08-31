export interface Subscription {
  [key: string]: {
    ws: WebSocket;
  };
}
export type IncomingReq = {
  username: string;
};
export type participants = {
  consversationId: string;
  userId: string;
}[];

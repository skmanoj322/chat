import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let users: {
  roomId: string;
  userId: string;
  ws: WebSocket;
}[] = [];
wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", function message(data) {
    const msg = JSON.parse(data.toString());
    if (msg.type === "join") {
      const checkUserExist = users.findIndex(
        (user) => user.userId === msg.payload.userId
      );
      if (checkUserExist === -1) {
        users = [
          ...users,
          { roomId: msg.payload.roomId, userId: msg.payload.userId, ws: ws },
        ];
      } else {
        if (users[checkUserExist].ws.OPEN !== 1) {
          console.log("users", users);
          users[checkUserExist] = msg.payload;
        }
      }
    }
    if (msg.type === "message") {
      users.forEach((user) => {
        console.log("Message Id", msg.payload.userId);
        if (
          user.userId !== msg.payload.userId &&
          user.roomId === msg.payload.roomId &&
          user.ws.OPEN === 1
        ) {
          console.log("USER ID ", user.userId);

          user.ws.send(
            JSON.stringify({
              type: "message",
              payload: {
                message: msg.payload.message,
                roomId: msg.payload.roomId,
                user: user.userId,
              },
            })
          );
        }
      });
    }
  });
});

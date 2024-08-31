"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const redis_1 = require("redis");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const publishClient = (0, redis_1.createClient)();
const subscribeClient = (0, redis_1.createClient)();
publishClient.connect();
subscribeClient.connect();
const subscription = {};
wss.on("connection", function connection(ws) {
    const id = randomId();
    subscription[id] = {
        ws: ws,
        rooms: [],
    };
    ws.on("message", function message(data) {
        //@ts-ignore
        const userMessage = JSON.parse(data);
        if (userMessage.type === "SUBSCRIBE") {
            console.log(userMessage);
            subscription[id].rooms.push(userMessage.rooms);
            //   ws.send(userMessage);
            if (onUserSubscribeTo(userMessage.rooms)) {
                subscribeClient.subscribe(userMessage.rooms, (message) => {
                    const parsedMessage = JSON.parse(message);
                    Object.keys(subscription).forEach((userId) => {
                        const { ws, rooms } = subscription[userId];
                        if (parsedMessage.roomId) {
                            ws.send(parsedMessage.message);
                        }
                    });
                });
            }
        }
        if (userMessage.type === "sendMessage") {
            const message = userMessage.message;
            const roomId = userMessage.rooms;
            // Object.keys(subscription).forEach((userId) => {
            //   const { ws, rooms } = subscription[userId];
            //   if (rooms.includes(roomId)) {
            //     ws.send(JSON.stringify(message));
            //   }
            // });
            publishClient.publish(roomId, JSON.stringify({
                type: "sendMessage",
                roomId: roomId,
                message,
            }));
        }
        if (userMessage.type === "UNSUBSCRIBE") {
            subscription[id].rooms = subscription[id].rooms.filter((x) => x !== userMessage.room);
            if (lastPersonLeftRoom(userMessage.room)) {
                console.log("UNSUBSCRIBE from ");
                subscribeClient.unsubscribe(userMessage.room);
            }
        }
    });
});
const randomId = () => {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
};
const onUserSubscribeTo = (roomId) => {
    let totalInterestedPeople = 0;
    Object.keys(subscription).map((userId) => {
        if (subscription[userId].rooms.includes(roomId)) {
            totalInterestedPeople++;
        }
    });
    if (totalInterestedPeople == 1) {
        return true;
    }
    return false;
};
const lastPersonLeftRoom = (roomId) => {
    let totalInterestedPeople = 0;
    Object.keys(subscription).map((userId) => {
        if (subscription[userId].rooms.includes(roomId)) {
            totalInterestedPeople++;
        }
    });
    console.log(totalInterestedPeople);
    if (totalInterestedPeople === 0) {
        return true;
    }
    return false;
};

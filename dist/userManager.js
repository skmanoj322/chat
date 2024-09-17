export class UserManager {
    subscription = {};
    static instance;
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }
    addSubscription(key, ws) {
        if (!this.subscription[key]) {
            this.subscription[key] = { ws };
        }
        else {
            this.subscription[key].ws = ws;
        }
        this.registerOnClose(ws, key);
        return this.getSubscription(key);
    }
    getSubscription(key) {
        return this.subscription[key];
    }
    registerOnClose(ws, id) {
        ws.on("close", () => {
            delete this.subscription[id];
        });
    }
    stringfyMessage(msg) {
        return JSON.stringify(msg);
    }
    parsedMessage(msg) {
        return JSON.parse(msg);
    }
    getAllSubscription() {
        return this.subscription;
    }
    emit(ws, msg) {
        return ws.send(JSON.stringify(msg));
    }
}

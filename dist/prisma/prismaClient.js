import { PrismaClient } from "@prisma/client";
export class prismaClient {
    static instance;
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new PrismaClient();
        }
        return this.instance;
    }
}

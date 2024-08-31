import { PrismaClient } from "@prisma/client";

export class prismaClient {
  private static instance: PrismaClient;
  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PrismaClient();
    }
    return this.instance;
  }
}

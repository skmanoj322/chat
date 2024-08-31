/*
  Warnings:

  - Added the required column `isPrivate` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL;

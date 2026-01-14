/*
  Warnings:

  - Added the required column `name` to the `Waitlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waitlist" ADD COLUMN     "name" TEXT NOT NULL;

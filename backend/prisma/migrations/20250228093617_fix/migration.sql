/*
  Warnings:

  - You are about to drop the column `meessage` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `message` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "meessage",
ADD COLUMN     "message" TEXT NOT NULL;

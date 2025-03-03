-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'email',
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'pwd';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile_img" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "password" DROP DEFAULT;

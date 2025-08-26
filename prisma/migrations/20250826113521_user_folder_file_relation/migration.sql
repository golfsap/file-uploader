/*
  Warnings:

  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.
  - Made the column `folderId` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_userId_fkey";

-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "userId",
ALTER COLUMN "folderId" SET NOT NULL;

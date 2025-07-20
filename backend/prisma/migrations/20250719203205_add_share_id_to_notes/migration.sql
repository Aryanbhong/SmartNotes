/*
  Warnings:

  - You are about to drop the column `notebookId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `Notebook` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shareId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_notebookId_fkey";

-- DropForeignKey
ALTER TABLE "Notebook" DROP CONSTRAINT "Notebook_userId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "notebookId",
ADD COLUMN     "shareId" TEXT;

-- DropTable
DROP TABLE "Notebook";

-- CreateIndex
CREATE UNIQUE INDEX "Note_shareId_key" ON "Note"("shareId");

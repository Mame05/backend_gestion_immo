/*
  Warnings:

  - You are about to drop the column `userId` on the `Commentaire` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Commentaire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_userId_fkey";

-- AlterTable
ALTER TABLE "Commentaire" DROP COLUMN "userId",
ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `date_ajout` on the `BienImmobilier` table. All the data in the column will be lost.
  - Added the required column `montant` to the `BienImmobilier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeTransaction` to the `BienImmobilier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('LOCATION', 'VENTE');

-- CreateEnum
CREATE TYPE "PeriodePaiement" AS ENUM ('MOIS', 'ANNEE', 'UNIQUE');

-- AlterTable
ALTER TABLE "BienImmobilier" DROP COLUMN "date_ajout",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "montant" INTEGER NOT NULL,
ADD COLUMN     "periodePaiement" "PeriodePaiement",
ADD COLUMN     "typeTransaction" "TypeTransaction" NOT NULL;

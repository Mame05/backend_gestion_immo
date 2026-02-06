-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AGENCE', 'CLIENT');

-- CreateEnum
CREATE TYPE "StatutBien" AS ENUM ('LIBRE', 'OCCUPE');

-- CreateEnum
CREATE TYPE "Categorie" AS ENUM ('MOYEN', 'LUXE');

-- CreateEnum
CREATE TYPE "StatutReservation" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom_complet" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BienImmobilier" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" "Categorie" NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "statut" "StatutBien" NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agenceId" INTEGER NOT NULL,

    CONSTRAINT "BienImmobilier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commentaire" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "date_publication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "bienId" INTEGER NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" "StatutReservation" NOT NULL,
    "userId" INTEGER NOT NULL,
    "bienId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "BienImmobilier" ADD CONSTRAINT "BienImmobilier_agenceId_fkey" FOREIGN KEY ("agenceId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "BienImmobilier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "BienImmobilier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

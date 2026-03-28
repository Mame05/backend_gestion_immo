-- CreateTable
CREATE TABLE "ImageBien" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "bienId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageBien_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageBien" ADD CONSTRAINT "ImageBien_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "BienImmobilier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

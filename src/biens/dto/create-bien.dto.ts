import { Categorie, PeriodePaiement, StatutBien, TypeTransaction } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBienDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsEnum(Categorie)
  @IsNotEmpty()
  categorie: Categorie;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  montant: number;

  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsEnum(StatutBien)
  @IsNotEmpty()
  statut: StatutBien;

  @IsEnum(TypeTransaction)
  @IsNotEmpty()
  typeTransaction: TypeTransaction;

  @IsOptional()
  @IsEnum(PeriodePaiement)
  periodePaiement?: PeriodePaiement;


}

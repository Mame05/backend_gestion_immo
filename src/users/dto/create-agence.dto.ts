import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateAgenceDto {
  @IsString()
  nom_complet: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  mot_passe: string;
}

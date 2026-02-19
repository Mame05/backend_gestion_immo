import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
export class RegisterDto {
  @IsString()
  nom_complet: string;


  @IsEmail()
  email: string;


  @MinLength(6)
  mot_passe: string;

   @IsEnum(Role)
  @IsOptional()
  role?: Role;

}

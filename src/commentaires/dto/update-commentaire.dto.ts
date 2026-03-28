import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentaireDto } from './create-commentaire.dto';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCommentaireDto extends PartialType(CreateCommentaireDto) {
  @IsOptional()
  @IsString()
  contenu?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  note?: number;
}

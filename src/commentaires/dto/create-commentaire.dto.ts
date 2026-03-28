import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @IsInt()
  @Min(1)
  @Max(5)
  note: number;
}

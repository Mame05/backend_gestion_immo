import { IsDateString, IsOptional } from "class-validator";

export class CreateReservationDto {
  @IsDateString()
  dateDebut: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;
}

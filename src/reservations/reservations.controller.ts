import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // CLIENT → réserver un bien
  @Post(':bienId')
  @Roles(Role.CLIENT)
  create(@Param('bienId') bienId: string, @Body() createReservationDto: CreateReservationDto, @GetUser() user: any) {
    return this.reservationsService.create(+bienId, createReservationDto, user.sub);
  }

  // CLIENT → voir ses réservations
  @Get('me')
  @Roles(Role.CLIENT)
  mesReservations(@GetUser() user: any) {
    return this.reservationsService.mesReservations(user.sub);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

 /* @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }*/
 // Pour l'annulation d'une réservation
 @Delete(':id')
 @UseGuards(AuthGuard('jwt'), RolesGuard)
 @Roles(Role.CLIENT, Role.AGENCE)
 annuler(
  @Param('id') id: string,
  @GetUser() user: any,
 ) {
  return this.reservationsService.annuler(
    +id,
    user.sub,
    user.role,
  );
 }

 // J'ai mis en commentaire la methode @Delete ci dessus car en fesant 
 // le teste de l'annulation il appelle cette premier méthode
}

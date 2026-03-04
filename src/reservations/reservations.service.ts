import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Role, StatutBien } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}
  async create(bienId: number, createReservationDto: CreateReservationDto, clientId: number,) {
    const bien = await this.prisma.bienImmobilier.findUnique({
      where: { id: bienId },
    });

    if (!bien) {
      throw new BadRequestException('Bien introuvable');
    }

    if (bien.statut === StatutBien.OCCUPE) {
      throw new ForbiddenException('Ce bien est déjà occupé');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        dateDebut: new Date(createReservationDto.dateDebut),
        dateFin: createReservationDto.dateFin ? new Date(createReservationDto.dateFin) : null,
        client: { connect: { id: clientId } },
        bien: { connect: { id: bienId } },
      },
    });

    // Mettre le bien en OCCUPE
    await this.prisma.bienImmobilier.update({
      where: { id: bienId },
      data: { statut: StatutBien.OCCUPE },
    });

    return reservation;
  }

  async mesReservations(clientId: number) {
    return this.prisma.reservation.findMany({
      where: { clientId },
      include: { bien: true },
    });
  
  }

  async annuler(reservationId: number, userId: number, role: Role) {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      bien: true,
    },
  });

  if (!reservation) {
    throw new BadRequestException('Réservation introuvable');
  }

  // 👤 CLIENT
  if (role === Role.CLIENT) {
    if (reservation.clientId !== userId) {
      throw new ForbiddenException('Vous ne pouvez annuler que vos réservations');
    }

    // ⏱ Optionnel : empêcher annulation après début
    if (new Date(reservation.dateDebut) <= new Date()) {
      throw new ForbiddenException('Annulation impossible après le début');
    }
  }

  // 🏢 AGENCE
  if (role === Role.AGENCE) {
    if (reservation.bien.agenceId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez annuler que les réservations de vos biens',
      );
    }
  }

  // 🗑 Suppression
  await this.prisma.reservation.delete({
    where: { id: reservationId },
  });

  // 🔁 Libérer le bien
  await this.prisma.bienImmobilier.update({
    where: { id: reservation.bienId },
    data: { statut: StatutBien.LIBRE },
  });

  return { message: 'Réservation annulée avec succès' };
}

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}

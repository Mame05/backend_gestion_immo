import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StatutBien } from '@prisma/client';

@Injectable()
export class BiensService {
  constructor(private prisma: PrismaService) {}
  async create(createBienDto: CreateBienDto, userId: number) {
    return this.prisma.bienImmobilier.create({
      data: {
        ...createBienDto,
        agenceId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.bienImmobilier.findMany({
      where: { statut: StatutBien.LIBRE }, // On utilise l'enum importé
      include: {
        agence: {
          select: { id: true, nom_complet: true, email: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const bien = await this.prisma.bienImmobilier.findUnique({
      where: { id },
      include: {
        agence: true,
        commentaires: {
          include: {
            user: {
              select: {
                id: true,
                nom_complet: true,
              },
            },
          },
        },
      },
    });

    if (!bien) {
      throw new NotFoundException(`Bien avec l'ID ${id} non trouvé`);
    }

    return bien;
  }

 async update(id: number, updateBienDto: UpdateBienDto, userId: number) {
    const bien = await this.prisma.bienImmobilier.findUnique({ where: { id } });

    if (!bien) {
      throw new NotFoundException(`Bien avec l'ID ${id} non trouvé`);
    }

    if (bien.agenceId !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres biens');
    }

    return this.prisma.bienImmobilier.update({
      where: { id },
      data: updateBienDto,
    });
  }

  async remove(id: number, userId: number, isAdmin: boolean = false) {
    const bien = await this.prisma.bienImmobilier.findUnique({ where: { id } });

    if (!bien) {
      throw new NotFoundException(`Bien avec l'ID ${id} non trouvé`);
    }

    if (!isAdmin && bien.agenceId !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres biens');
    }

    return this.prisma.bienImmobilier.delete({ where: { id } });
  
  }
}

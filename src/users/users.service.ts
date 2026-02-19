import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 🔐 Création d'une AGENCE (ADMIN uniquement)
  async createAgence(dto: CreateAgenceDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(dto.mot_passe, 10);

    return this.prisma.user.create({
      data: {
        nom_complet: dto.nom_complet,
        email: dto.email,
        mot_passe: hashedPassword,
        role: Role.AGENCE,
      },
      select: {
        id: true,
        nom_complet: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nom_complet: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }
   async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateAgenceDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

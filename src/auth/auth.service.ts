import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}


  async registerClient(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.mot_passe, 10);


    const user = await this.prisma.user.create({
      data: {
        nom_complet: dto.nom_complet,
        email: dto.email,
        mot_passe: hashedPassword,
        role: Role.CLIENT,
      },
    });


    return {
    access_token: this.signToken(user.id, user.email, user.role).access_token,
    user: {
      id: user.id,
      nom_complet: user.nom_complet,
      email: user.email,
      role: user.role,
      // ⚠️ Ne jamais retourner le password !
    }
   };
  }


  async login(email: string, mot_passe: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });


    if (!user || !(await bcrypt.compare(mot_passe, user.mot_passe))) {
      throw new UnauthorizedException('Identifiants invalides');
    }


    return this.signToken(user.id, user.email, user.role);
  }


  private signToken(userId: number, email: string, role: Role) {
    return {
      access_token: this.jwtService.sign({
        sub: userId,
        email,
        role,
      }),
    };
  }

}

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentairesService {
  constructor(private prisma: PrismaService) {}
  async create(bienId: number, createCommentaireDto: CreateCommentaireDto, clientId: number,) {
     // Vérifier que le bien existe
    const bien = await this.prisma.bienImmobilier.findUnique({
      where: { id: bienId },
    });

    if (!bien) {
      throw new BadRequestException('Bien introuvable');
    }

    // ⭐ OPTION AVANCÉE : vérifier que le client a réservé ce bien
    const aReserve = await this.prisma.reservation.findFirst({
      where: {
        bienId,
        clientId,
      },
    });

    if (!aReserve) {
      throw new ForbiddenException(
        'Vous devez avoir réservé ce bien pour commenter',
      );
    }
    return this.prisma.commentaire.create({
      data: {
        contenu: createCommentaireDto.contenu,
        client: { connect: { id: clientId } },
        bien: { connect: { id: bienId } },
      },
    });
  }

  async findByBien(bienId: number) {
    return this.prisma.commentaire.findMany({
      where: { bienId },
      include: {
        client: {
          select: {
            id: true,
            nom_complet: true,
          },
        },
      },
      orderBy: { date_publication: 'desc' },
    });
  }
  findAll() {
    return `This action returns all commentaires`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentaire`;
  }

  async update(commentaireId: number, updateCommentaireDto: UpdateCommentaireDto, clientId: number,) {
    const commentaire = await this.prisma.commentaire.findUnique({
    where: { id: commentaireId },
   });

    if (!commentaire) {
     throw new BadRequestException('Commentaire introuvable');
   }

   // seul l'auteur peut modifier
   if (commentaire.clientId !== clientId) {
    throw new ForbiddenException(
      'Vous ne pouvez modifier que votre commentaire',
    );
   }
    return this.prisma.commentaire.update({
    where: { id: commentaireId },
    data: updateCommentaireDto,
   });
  }

  remove(id: number) {
    return `This action removes a #${id} commentaire`;
  }
}

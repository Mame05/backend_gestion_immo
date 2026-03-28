import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StatutBien } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BiensService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService,) {}
  async create(createBienDto: CreateBienDto, userId: number, mainImage: string, gallery: {url: string; publicId:string}[]) {
    const bien = await this.prisma.bienImmobilier.create({
      data: {
        ...createBienDto,
        montant: Number(createBienDto.montant),
        image: mainImage,
        agenceId: userId,
      },
    });
    // sauvegarde galerie
  for (const img of gallery) {
    await this.prisma.imageBien.create({
      data: {
        url: img.url,
        publicId: img.publicId,
        bienId: bien.id,
      },
    });
  }

  return bien;
}

  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const where: any = {
      statut: StatutBien.LIBRE, // 👈 toujours afficher les biens libres
     };

    // 🔎 Filtre adresse
    if (query.adresse) {
      where.adresse = {
        contains: query.adresse,
        mode: 'insensitive',
      };
    }
    // 🔎 Filtre catégorie
  if (query.categorie) {
    where.categorie = query.categorie.toUpperCase();
  }

  // 🔎 Filtre transaction
  if (query.typeTransaction) {
    where.typeTransaction = query.typeTransaction.toUpperCase();
  }

  // 💰 Filtre prix
  if (query.prixMin || query.prixMax) {
    where.montant = {};

    if (query.prixMin) {
      where.montant.gte = Number(query.prixMin);
    }

    if (query.prixMax) {
      where.montant.lte = Number(query.prixMax);
    }
  }

  // 📊 Tri
  const orderBy = query.sort
    ? {
        [query.sort]: query.order === 'desc' ? 'desc' : 'asc',
      }
    : undefined;
    const biens = await this.prisma.bienImmobilier.findMany({
      where, // maintenant les filtres sont utilisés
      include: {
        agence: {
          select: { id: true, nom_complet: true, email: true },
        },
      },
      skip,
      take: limit,
      orderBy:{
        createdAt: 'desc',
      },
    });
    return biens;
  }

  async findOne(id: number) {
    const bien = await this.prisma.bienImmobilier.findUnique({
      where: { id },
      include: {
        agence: {
          select: {
            id: true,
            nom_complet: true,
            email: true
          }
        },
        images: true,
        commentaires: {
          include: {
            client: {
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

  // Ajouter des images à un bien
  async addImages(bienId: number, userId: number, files: Express.Multer.File[]) {

  const bien = await this.prisma.bienImmobilier.findUnique({
    where: { id: bienId },
  });

  if (!bien) {
    throw new NotFoundException('Bien introuvable');
  }

  //Empêcher une agence de modifier le bien d'une autre agence.
  if (bien.agenceId !== userId) {
    throw new ForbiddenException('Accès refusé');
  }
  console.log('agence du bien:', bien.agenceId);
  console.log('user connecté:', userId);

  const imagesCount = await this.prisma.imageBien.count({
    where: { bienId },
  });

  if (imagesCount + files.length > 10) {
    throw new BadRequestException('Maximum 10 images par bien');
  }

  const uploadedImages: any[] = [];

  for (const file of files) {
    const upload = await this.cloudinaryService.uploadImage(file);

    const image = await this.prisma.imageBien.create({
      data: {
        url: upload.secure_url,
        publicId: upload.public_id,
        bienId,
      },
    });

    uploadedImages.push(image);
  }

  return uploadedImages;
}

//Supprimer une image
async deleteImage(imageId: number, userId: number) {

  const image = await this.prisma.imageBien.findUnique({
    where: { id: imageId },
    include: {bien: true},
  });

  if (!image) {
    throw new NotFoundException('Image introuvable');
  }
  //Empêcher une agence de modifier le bien d'une autre agence.
  if (image.bien.agenceId !== userId) {
  throw new ForbiddenException('Accès refusé');
  }

  await this.cloudinaryService.deleteImage(image.publicId);

  await this.prisma.imageBien.delete({
    where: { id: imageId },
  });

  return { message: 'Image supprimée' };
}

// Changer l'image principale
// L'image sera remplacer par une image qui se trouve dans la gallerie
async setMainImage(bienId: number, imageId: number, userId: number) {

  const image = await this.prisma.imageBien.findUnique({
    where: { id: imageId },
    include: {bien: true},
  });

  if (!image) {
    throw new NotFoundException('Image introuvable');
  }
  //Empêcher une agence de modifier le bien d'une autre agence.
  if (image.bien.agenceId !== userId) {
  throw new ForbiddenException('Accès refusé');
  }

  const bien = await this.prisma.bienImmobilier.update({
    where: { id: bienId },
    data: {
      image: image.url,
    },
  });

  return bien;
}

}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BiensService } from './biens.service';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('biens')
export class BiensController {
  constructor(
    private readonly biensService: BiensService,
    private cloudinaryService: CloudinaryService,
) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.AGENCE)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createBienDto: CreateBienDto,
    @Req() req: any,
  ) {

    // image principale
  const mainImage: any = await this.cloudinaryService.uploadImage(files[0]);

  // galerie
  const gallery: { url: string; publicId: string }[] = [];

  for (let i = 1; i < files.length; i++) {
    const uploaded: any = await this.cloudinaryService.uploadImage(files[i]);
    gallery.push(
      {url: uploaded.secure_url,
       publicId: uploaded.public_id,
    });
  } 
    return this.biensService.create(
      createBienDto, 
      req.user.sub,
      mainImage.secure_url,
      gallery,
    );
  }

  @Get()
  findAll(@Query() query: any) {
    return this.biensService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.biensService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBienDto: UpdateBienDto, @Req() req) {
    return this.biensService.update(+id, updateBienDto, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    const isAdmin = req.user.role === Role.ADMIN;
    return this.biensService.remove(+id, req.user.sub, isAdmin);
  }

  // Ajouter des images à un bien
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.AGENCE)
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async addImages(
  @Param('id') id: string,
  @UploadedFiles() files: Express.Multer.File[],
  @Req() req: any,
) {
  console.log('USER CONNECTÉ:', req.user);
  return this.biensService.addImages(+id, req.user.sub, files);
}

// Supprimer une image
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.AGENCE)
@Delete('images/:imageId')
deleteImage(@Param('imageId') imageId: string, @Req() req: any,) {
  return this.biensService.deleteImage(+imageId, req.user.sub);
}

// Changer l'image principale
// teste postman lien/biens/10/main-image/3 {10= id du bien 3= id d'un image qui est dans la table imageBien maintenant on veux que l'image 3 devienne l'image principale}
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.AGENCE)
@Patch(':bienId/main-image/:imageId')
setMainImage(
  @Param('bienId') bienId: string,
  @Param('imageId') imageId: string,
  @Req() req: any,
) {
  return this.biensService.setMainImage(+bienId, +imageId, req.user.sub);
}
}

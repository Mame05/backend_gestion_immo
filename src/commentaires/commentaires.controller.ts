import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentairesService } from './commentaires.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { UpdateCommentaireDto } from './dto/update-commentaire.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('commentaires')
export class CommentairesController {
  constructor(private readonly commentairesService: CommentairesService) {}

  // CLIENT → ajouter un commentaire
  @Post(':bienId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLIENT)
  create(
    @Param('bienId') bienId: string, 
    @Body() createCommentaireDto: CreateCommentaireDto,
    @GetUser() user: any,
  ) {
    return this.commentairesService.create(
       +bienId,
       createCommentaireDto,
      user.sub,
    );
  }

  // PUBLIC → voir les commentaires d’un bien
  @Get(':bienId')
  findByBien(@Param('bienId') bienId: string) {
    return this.commentairesService.findByBien(+bienId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentairesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLIENT)
  update(@Param('id') id: string, @Body() updateCommentaireDto: UpdateCommentaireDto, @GetUser() user: any,) {
    return this.commentairesService.update(+id, updateCommentaireDto, user.sub,);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentairesService.remove(+id);
  }
}

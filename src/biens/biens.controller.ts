import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { BiensService } from './biens.service';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('biens')
export class BiensController {
  constructor(private readonly biensService: BiensService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.AGENCE)
  @Post()
  create(@Body() createBienDto: CreateBienDto,  @Req() req: any) {
    return this.biensService.create(createBienDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.biensService.findAll();
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
}

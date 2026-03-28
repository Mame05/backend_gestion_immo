import { Module } from '@nestjs/common';
import { CommentairesService } from './commentaires.service';
import { CommentairesController } from './commentaires.controller';

@Module({
  controllers: [CommentairesController],
  providers: [CommentairesService],
})
export class CommentairesModule {}

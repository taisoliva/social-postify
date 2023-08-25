import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { MediasModule } from 'src/medias/medias.module';
import { PostsModule } from 'src/posts/posts.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  imports: [MediasModule, PostsModule, PrismaModule]
})
export class PublicationsModule {}

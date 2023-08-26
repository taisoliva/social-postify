import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsRepository } from './posts.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  imports:[PrismaModule],
  exports:[PostsService]
})
export class PostsModule {}

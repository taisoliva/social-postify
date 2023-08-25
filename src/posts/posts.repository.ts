import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsRepository {

  constructor (private readonly prisma:PrismaService) {}

  async create(createPostDto: CreatePostDto) {
   return await this.prisma.posts.create({
    data:createPostDto
   })
  }

  async findAll() {
    return await this.prisma.posts.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.posts.findFirst({
      where:{id}
    })
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const result = await this.prisma.posts.update({
      where:{id},
      data:updatePostDto
    })

    return [result]
  }

  async remove(id: number) {
    return this.prisma.posts.delete({
      where:{id}
    })
  }

  async PostIdPublications(id:number){
    return await this.prisma.posts.findFirst({
      where:{id},
      include:{
        publications:true
      }
    })
  }
}

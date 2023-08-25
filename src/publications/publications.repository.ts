import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicationsRepository {

  constructor(private readonly prisma:PrismaService) {}
  
  async create(createPublicationDto: CreatePublicationDto) {
    return await this.prisma.publications.create({
      data: {
        mediaId:createPublicationDto.mediaId,
        postsId: createPublicationDto.postId,
        date: createPublicationDto.date
      }
    })
  }

  async findAll() {
    return await this.prisma.publications.findMany() ;
  }

  findOne(id: number) {
    return this.prisma.publications.findFirst({
      where:{id}
    })
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return this.prisma.publications.update({
      where:{id},
      data: {
        mediaId:updatePublicationDto.mediaId,
        postsId:updatePublicationDto.postId,
        date:updatePublicationDto.date
      }
    });
  }

  remove(id: number) {
    return this.prisma.publications.delete({
      where:{id}
    })
  }
}

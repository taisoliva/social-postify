import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'; 
import { after } from 'node:test';

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

  async findAll(params?:{ published?: string, after?: string }) {

    const where: Prisma.PublicationsWhereInput = {}
    const currentDate = new Date()
    const published = params?.published !== undefined ? JSON.parse(params.published) : undefined;
    
    if(published === undefined && params?.after === undefined){
      return await this.prisma.publications.findMany({
      })
    }

    if(published && params?.after === undefined){
      where.date = {lte: currentDate}
    }

    if(!published && params?.after === undefined){
      where.date = {gte: currentDate}
    }

    if(published === undefined && params?.after){
      where.date = {gte: new Date(params.after)}
    }

    if(published && params?.after){
      where.date = {
        gte: new Date(params.after),
        lte: currentDate
      }
    }

    if(!published && params?.after){
      where.date = {
        gte: new Date(params.after),
        gt: currentDate
      }
    }

      
    return await this.prisma.publications.findMany({
      where
    })
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

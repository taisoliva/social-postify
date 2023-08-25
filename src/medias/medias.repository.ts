import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor (private readonly prisma: PrismaService) {}

  async createMedias(createMediaDto: CreateMediaDto){
    return this.prisma.medias.create({data:
      createMediaDto
    })
  }

  async lookingForIgual(title: string, username: string){
    return await this.prisma.medias.findFirst({
      where:{
        title,
        username
      }
    })
  }

 async findAll() {
    return await this.prisma.medias.findMany()
  }

  async findFirst(id: number) {
    return await this.prisma.medias.findFirst({
      where:{id}
    })
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    return await this.prisma.medias.update({
      where:{id},
      data:updateMediaDto
    })
  }

  async remove(id: number) {
    return await this.prisma.medias.delete({
      where:{id}
    })
  }

  async MediaIdPublications(id:number){
    return await this.prisma.medias.findFirst({
      where:{id},
      include:{
        publications:true
      }
    })
  }
}

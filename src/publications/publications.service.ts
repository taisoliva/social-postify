import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PublicationsService {

  constructor(private readonly publicationsRepository: PublicationsRepository, private mediasService: MediasService, private postsServices: PostsService) { }

  async findId(id: number){
    const result = await this.publicationsRepository.findOne(id)
    if(!result){
      throw new NotFoundException(`Not Found Publication ${id}`)
    }
    return result
  }

  async isPublished(id:number){
    const result = await this.publicationsRepository.findOne(id)
    if(result.date < new Date()){
     throw new ForbiddenException(`Published! You can't edit`)
    } 
  }
  
  async create(createPublicationDto: CreatePublicationDto) {
    await this.mediasService.findOne(createPublicationDto.mediaId)
    await this.postsServices.findOne(createPublicationDto.postId)

    return this.publicationsRepository.create(createPublicationDto)
  }

  async findAll(params?:object) {
    const result = await this.publicationsRepository.findAll(params)
    return result
  }

  async findOne(id: number) {
    const data = await this.findId(id)
    return [data]
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    await this.findId(id)
    await this.mediasService.findOne(updatePublicationDto.mediaId)
    await this.postsServices.findOne(updatePublicationDto.postId)
    await this.isPublished(id)
    const result = await this.publicationsRepository.update(id,updatePublicationDto)
    return [result]
  }

  async remove(id: number) {
    await this.findId(id)
    return this.publicationsRepository.remove(id)
  }
}

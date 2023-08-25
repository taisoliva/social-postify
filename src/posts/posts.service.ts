import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {

  constructor (private postsRepository: PostsRepository) {}

  async FindId(id: number) {
    const data = await this.postsRepository.findOne(id)
    if (!data) {
      throw new NotFoundException(`Not Found id ${id}`)
    }

    return data
  }

  create(createPostDto: CreatePostDto) {
    return this.postsRepository.create(createPostDto)
  }

  findAll() {
    return this.postsRepository.findAll()  
  }

  async findOne(id: number) {
   const data = await this.FindId(id)
    return [data]
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.FindId(id)
    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    await this.FindId(id)
    const result = await this.postsRepository.PostIdPublications(id)
    if(result.publications.length !== 0){
      throw new ForbiddenException(`Post is being used`)
    }
    return await this.postsRepository.remove(id) 
  }
}

import { ConflictException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {

  constructor(private mediasRepository: MediasRepository) { }

  async FindId(id: number) {
    const data = await this.mediasRepository.findFirst(id)
    if (!data) {
      throw new NotFoundException(`Not Found id ${id}`)
    }

    return data
  }

  async create(createMediaDto: CreateMediaDto) {
    const lookingForIgual = await this.mediasRepository.lookingForIgual(createMediaDto.title, createMediaDto.username)
    if (lookingForIgual) {
      throw new ConflictException('Item already exists')
    }

    return this.mediasRepository.createMedias(createMediaDto)
  }

  findAll() {
    return this.mediasRepository.findAll();
  }

  async findOne(id: number) {
    const data = await this.FindId(id)
    return [data]
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    await this.FindId(id)

    if (await this.mediasRepository.lookingForIgual(updateMediaDto.title, updateMediaDto.username)) {
      throw new ConflictException(`Item already exists ${updateMediaDto.title} and ${updateMediaDto.username}`)
    }

    const result = await this.mediasRepository.update(id, updateMediaDto)

    return [result]
  }

  async remove(id: number) {
    await this.FindId(id)
    return await this.mediasRepository.remove(id)
  }
}

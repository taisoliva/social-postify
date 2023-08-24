import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMediaDto {

    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsString()
    @IsNotEmpty()
    username: string
}

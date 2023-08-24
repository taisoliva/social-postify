import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreatePostDto {
    
    @IsString()
    @IsNotEmpty()
    title : string

    @IsString()
    @IsNotEmpty()
    text : string

    @Optional()
    @IsString()
    @IsUrl()
    image: string
}

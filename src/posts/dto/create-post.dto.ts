import { IsEmpty, IsString } from "class-validator";

export class CreatePostDto {
    
    @IsString()
    @IsEmpty()
    title : string

    @IsString()
    @IsEmpty()
    text : string


}

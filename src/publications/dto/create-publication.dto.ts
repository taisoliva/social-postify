import { IsNotEmpty } from "class-validator";

export class CreatePublicationDto {

    @IsNotEmpty()
    mediaId: number

    @IsNotEmpty()
    postId: number

    @IsNotEmpty()
    date: Date
}

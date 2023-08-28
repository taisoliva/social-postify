import { PrismaService } from "src/prisma/prisma.service"

export class PublicationFactory {
    static async build(prisma: PrismaService, mediaId?:number, postsId?:number, date?:string) {
        return prisma.publications.create({
            data : {
                mediaId,
                postsId,
                date: date ?  date : new Date()
            }
        })
    }
}
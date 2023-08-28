import { PrismaService } from "src/prisma/prisma.service"

export class MediaFactory {
    static async build(prisma: PrismaService, title?:string, username?:string) {
        return prisma.medias.create({
            data : {
                title: title ? title : "tests",
                username: username ? username :'tests'
            }
        })
    }
}
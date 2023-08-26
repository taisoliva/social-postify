import { PrismaService } from "src/prisma/prisma.service"

export class MediaFactory {
    static async build(prisma: PrismaService) {
        return prisma.medias.create({
            data : {
                title: "tests",
                username: 'tests'
            }
        })
    }
}
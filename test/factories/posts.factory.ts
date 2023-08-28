import { PrismaService } from "src/prisma/prisma.service"

export class PostFactory {
    static async build(prisma: PrismaService, title?:string, text?:string) {
        return prisma.posts.create({
            data : {
                title: title ? title : "tests",
                text: text ? text :'tests',
            }
        })
    }
}
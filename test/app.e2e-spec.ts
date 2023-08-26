import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { MediaFactory } from './factories/medias.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    prisma = await moduleFixture.get(PrismaService)
    await prisma.publications.deleteMany()
    await prisma.medias.deleteMany()
    await prisma.posts.deleteMany()
    await app.init();
  });

  it('/health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('I’m okay!');
  });

  describe('Medias', () => {
    it('POST /medias => should return successfully', async () => {
      await request(app.getHttpServer())
        .post('/medias')
        .send({
          "title": "Instagram",
          "username": "tais"
        })
        .expect(HttpStatus.CREATED)
    })

    it('POST /medias => should return Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/medias')
        .send({
          "title": "Instagram",
          "username": 123
        })
       
      expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('POST /medias => should return Conflict', async () => {
      await MediaFactory.build(prisma)

      await request(app.getHttpServer())
        .post('/medias')
        .send({
          "title": "tests",
          "username": "tests"
        })
        .expect(HttpStatus.CONFLICT)
    })

    it('GET /medias => should return Medias', async () => {
      await MediaFactory.build(prisma)
      await MediaFactory.build(prisma)

      const response = await request(app.getHttpServer()).get('/medias')
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(2)
    })
  })
});

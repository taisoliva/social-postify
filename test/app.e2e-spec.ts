import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { MediaFactory } from './factories/medias.factory';
import { PostFactory } from './factories/posts.factory';
import { PublicationFactory } from './factories/publication.factory';

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
    it('POST /medias => should return 201 successfully', async () => {
      await request(app.getHttpServer())
        .post('/medias')
        .send({
          "title": "Instagram",
          "username": "tais"
        })
        .expect(HttpStatus.CREATED)
    })

    it('POST /medias => should return 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/medias')
        .send({
          "title": "Instagram",
          "username": 123
        })

      expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('POST /medias => should return 409 Conflict', async () => {
      await MediaFactory.build(prisma)

      await request(app.getHttpServer())
        .post('/medias')
        .send({
          "title": "tests",
          "username": "tests"
        })
        .expect(HttpStatus.CONFLICT)
    })

    it('GET /medias => should return 200 Medias', async () => {
      await MediaFactory.build(prisma)
      await MediaFactory.build(prisma)

      const response = await request(app.getHttpServer()).get('/medias')
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(2)
    })

    it('GET /medias/:id => should return 200 Medias by Id', async () => {
      const media = await MediaFactory.build(prisma)
      const response = await request(app.getHttpServer()).get(`/medias/${media.id}`)
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(1)
    })

    it('GET /medias/:id => should return an error 404 if media id not exist', async () => {
      const media = await MediaFactory.build(prisma)
      const response = await request(app.getHttpServer()).get(`/medias/${1}`)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('PUT /medias/:id => should return update media by id', async () => {
      const media = await MediaFactory.build(prisma)
      const body = {
        title: "ola",
        username: "ola2"
      }
      await request(app.getHttpServer()).put(`/medias/${media.id}`).send(body)
      const response = await request(app.getHttpServer()).get(`/medias/${media.id}`)
      expect(response.body[0].title).toEqual(body.title)
      expect(response.body[0].username).toEqual(body.username)
    })

    it('PUT /medias/:id => should return an error 404 if media id not found', async () => {
      const media = await MediaFactory.build(prisma)
      const body = {
        title: "ola",
        username: "ola2"
      }
      const response = await request(app.getHttpServer()).put(`/medias/${1}`).send(body)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('PUT /medias/:id => should return an error 409 if media id has conflict', async () => {
      const media1 = await MediaFactory.build(prisma, "ola", "ola2")
      const media2 = await MediaFactory.build(prisma)

      const body = {
        title: "ola",
        username: "ola2"
      }
      const response = await request(app.getHttpServer()).put(`/medias/${media2.id}`).send(body)
      expect(response.statusCode).toBe(HttpStatus.CONFLICT)
    })

    it('DELETE /medias/:id => should delete media by id', async () => {
      const media = await MediaFactory.build(prisma)

      const response = await request(app.getHttpServer()).delete(`/medias/${media.id}`)
      expect(response.statusCode).toBe(HttpStatus.OK)
    })

    it('DELETE /medias/:id => should delete 404 media by id', async () => {
      const media = await MediaFactory.build(prisma)
      const response = await request(app.getHttpServer()).delete(`/medias/${1}`)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('DELETE /medias/:id => should delete 403 media by id', async () => {
      const media = await MediaFactory.build(prisma)
      const post = await PostFactory.build(prisma)
      await PublicationFactory.build(prisma, media.id, post.id)

      const response = await request(app.getHttpServer()).delete(`/medias/${media.id}`)
      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
    })
  })

  describe('Posts', () => {
    it('POST /posts => should return 201 successfully', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .send({
          "title": "Instagram",
          "text": "tais"
        })
        .expect(HttpStatus.CREATED)
    })

    it('POST /posts => should return 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .send({
          "title": "Instagram",
          "text": 123
        })

      expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('GET /posts => should return statusCode 200', async () => {
      await PostFactory.build(prisma)
      await PostFactory.build(prisma)

      const response = await request(app.getHttpServer()).get('/posts')
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(2)
    })

    it('GET /posts/:id => should return statusCode 200 Posts by Id', async () => {
      const post = await PostFactory.build(prisma)
      const response = await request(app.getHttpServer()).get(`/posts/${post.id}`)
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(1)
    })

    it('GET /posts/:id => should return an error 404 if post id not exist', async () => {
      const post = await PostFactory.build(prisma)
      const response = await request(app.getHttpServer()).get(`/posts/${1}`)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('PUT /posts/:id => should return update media by id', async () => {
      const post = await PostFactory.build(prisma)
      const body = {
        title: "ola",
        text: "ola2"
      }
      await request(app.getHttpServer()).put(`/posts/${post.id}`).send(body)
      const response = await request(app.getHttpServer()).get(`/posts/${post.id}`)
      expect(response.body[0].title).toEqual(body.title)
      expect(response.body[0].text).toEqual(body.text)
    })

    it('PUT /posts/:id => should return an error 404 if media id not found', async () => {
      await PostFactory.build(prisma)
      const body = {
        title: "ola",
        username: "ola2"
      }
      const response = await request(app.getHttpServer()).put(`/posts/${1}`).send(body)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('DELETE /posts/:id => should delete media by id', async () => {
      const post = await PostFactory.build(prisma)

      const response = await request(app.getHttpServer()).delete(`/posts/${post.id}`)
      expect(response.statusCode).toBe(HttpStatus.OK)
    })

    it('DELETE /posts/:id => should delete 404 media by id', async () => {
      const post = await MediaFactory.build(prisma)
      const response = await request(app.getHttpServer()).delete(`/posts/${1}`)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('DELETE /post/:id => should delete 403 media by id', async () => {
      const media = await MediaFactory.build(prisma)
      const post = await PostFactory.build(prisma)
      await PublicationFactory.build(prisma, media.id, post.id)

      const response = await request(app.getHttpServer()).delete(`/posts/${post.id}`)
      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
    })
  })

  describe('Publications', () => {
    it('POST /publications => should return 201 successfully', async () => {
      const media = await MediaFactory.build(prisma)
      const post = await PostFactory.build(prisma)
      await request(app.getHttpServer())
        .post('/publications')
        .send({
          "mediaId": media.id,
          "postId": post.id,
          "date": new Date()
        })
        .expect(HttpStatus.CREATED)
    })

    it('POST /publications => should return 400 Bad Request', async () => {
      const response = await request(app.getHttpServer())
        .post('/publications')
        .send({
        })

      expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST)
    })

    it('POST /publications => should return 404 mediaId ou postId not found', async () => {
      await request(app.getHttpServer())
        .post('/publications')
        .send({
          "mediaId": 1,
          "postId": 1,
          "date": new Date()
        })
        .expect(HttpStatus.NOT_FOUND)
    })

    it('GET /publications => should return statusCode 200', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      const media2 = await MediaFactory.build(prisma)
      const post2 = await PostFactory.build(prisma)

      await PublicationFactory.build(prisma, media1.id, post1.id)
      await PublicationFactory.build(prisma, media2.id, post2.id)

      const response = await request(app.getHttpServer()).get('/publications')
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(2)
    })

    it('GET /publications?published=true => should return publications published', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-26T13:25:17.352Z")

      const response = await request(app.getHttpServer()).get(`/publications?published=true`)
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(1)
    })

    it('GET /publications?published=false => should return publications not published', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-29T13:25:17.352Z")

      const response = await request(app.getHttpServer()).get(`/publications?published=false`)
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(1)
    })

    it('GET /publications?after=date => should return publications published', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-29T13:25:17.352Z")

      const response = await request(app.getHttpServer()).get(`/publications?after="2023-08-26"`)
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(1)
    })

    it('GET /publications/:id => should return publications by Id', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      const publication = await PublicationFactory.build(prisma, media1.id, post1.id)

      const response = await request(app.getHttpServer()).get(`/publications/${publication.id}`)
      expect(response.statusCode).toBe(HttpStatus.OK)
      expect(response.body).toHaveLength(1)
    })

    it('GET /publications/:id => should return an error 404 if post id not exist', async () => {
      const response = await request(app.getHttpServer()).get(`/publications/${1}`)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('PUT /publications/:id => should return update media by id', async () => {

      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      const publication = await PublicationFactory.build(prisma, media1.id, post1.id, "2023-09-01T13:25:17.352Z")

      const body = {
        "mediaId": media1.id,
        "postId": post1.id,
        "date": "2023-09-21T13:25:17.352Z"
      }
      await request(app.getHttpServer()).put(`/publications/${publication.id}`).send(body)
      const response = await request(app.getHttpServer()).put(`/publications/${publication.id}`)
      expect(response.body[0].date).toEqual(body.date)
    })

    it('PUT /publications/:id => should return an error 403 if publication is published', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      const publication = await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-27T13:25:17.352Z")

      const body = {
        "mediaId": media1.id,
        "postId": post1.id,
        "date": "2023-09-21T13:25:17.352Z"
      }
      const response = await request(app.getHttpServer()).put(`/publications/${publication.id}`).send(body)

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN)
    })

    it('PUT /publications/:id => should return an error 404 if publication not exist', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-27T13:25:17.352Z")

      const body = {
        "mediaId": media1.id,
        "postId": post1.id,
        "date": "2023-09-21T13:25:17.352Z"
      }
      const response = await request(app.getHttpServer()).put(`/publications/${1}`).send(body)

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('PUT /publications/:id => should return an error 404 if mediaId or postId not exist', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)

      const publication = await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-27T13:25:17.352Z")

      const body = {
        "mediaId": 1,
        "postId": post1.id,
        "date": "2023-09-21T13:25:17.352Z"
      }
      const response = await request(app.getHttpServer()).put(`/publications/${publication.id}`).send(body)

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })

    it('DELETE /publications/:id => should delete publication by id', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)
      const publication = await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-27T13:25:17.352Z")


      const response = await request(app.getHttpServer()).delete(`/publications/${publication.id}`)
      expect(response.statusCode).toBe(HttpStatus.OK)
    })

    it('DELETE /publications/:id => should return 404 if publication by id not exist', async () => {
      const media1 = await MediaFactory.build(prisma)
      const post1 = await PostFactory.build(prisma)
      const publication = await PublicationFactory.build(prisma, media1.id, post1.id, "2023-08-27T13:25:17.352Z")


      const response = await request(app.getHttpServer()).delete(`/publications/${1}`)
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
    })
  })
});

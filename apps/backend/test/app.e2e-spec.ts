import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/auth/user.entity';
import * as bcrypt from 'bcryptjs';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    await app.init();

    // seed demo user for tests
    const ds = app.get(DataSource);
    const repo = ds.getRepository(UserEntity);
    const demoEmail = 'demo@carreirapro.app';
    const exists = await repo.findOne({ where: { email: demoEmail } });
    if (!exists) {
      await repo.save(
        repo.create({
          email: demoEmail,
          passwordHash: bcrypt.hashSync('demo123', 10),
        }),
      );
    }
  });

  it('/health (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body?.status).toBe('ok');
  });

  it('auth + profile flow', async () => {
    // login demo
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'demo@carreirapro.app', password: 'demo123' })
      .expect(201);
    expect(login.body.accessToken).toBeTruthy();
    const token = login.body.accessToken as string;

    // get profile
    const me = await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(me.body?.id).toBeTruthy();

    // create experience
    const xp = await request(app.getHttpServer())
      .post('/profile/experiences')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Dev', company: 'Acme' })
      .expect(201);
    expect(xp.body?.id).toBeTruthy();

    // list experiences
    const list = await request(app.getHttpServer())
      .get('/profile/experiences')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body)).toBe(true);

    // delete experience
    await request(app.getHttpServer())
      .delete(`/profile/experiences/${xp.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // education CRUD
    const eduCreate = await request(app.getHttpServer())
      .post('/profile/education')
      .set('Authorization', `Bearer ${token}`)
      .send({ institution: 'Uni X', degree: 'CS' })
      .expect(201);
    expect(eduCreate.body?.id).toBeTruthy();

    const eduUpdate = await request(app.getHttpServer())
      .put(`/profile/education/${eduCreate.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ degree: 'Computer Science' })
      .expect(200);
    expect(eduUpdate.body?.degree).toBe('Computer Science');

    await request(app.getHttpServer())
      .delete(`/profile/education/${eduCreate.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // skills CRUD
    const skCreate = await request(app.getHttpServer())
      .post('/profile/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Node.js', level: 4 })
      .expect(201);
    expect(skCreate.body?.id).toBeTruthy();

    const skUpdate = await request(app.getHttpServer())
      .put(`/profile/skills/${skCreate.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ level: 5 })
      .expect(200);
    expect(skUpdate.body?.level).toBe(5);

    await request(app.getHttpServer())
      .delete(`/profile/skills/${skCreate.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // profile URL validation
    await request(app.getHttpServer())
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ linkedin: 'not-a-url' })
      .expect(400);

    await request(app.getHttpServer())
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ linkedin: 'https://linkedin.com/in/demo' })
      .expect(200);
  });

  it('documents flow', async () => {
    // login demo
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'demo@carreirapro.app', password: 'demo123' })
      .expect(201);
    const token = login.body.accessToken as string;

    // list (empty)
    const listEmpty = await request(app.getHttpServer())
      .get('/documents')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(listEmpty.body)).toBe(true);

    // create
    const created = await request(app.getHttpServer())
      .post('/documents')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Meu Doc' })
      .expect(201);
    expect(created.body?.id).toBeTruthy();
    const docId = created.body.id as string;

    // rename
    const renamed = await request(app.getHttpServer())
      .put(`/documents/${docId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Documento Renomeado' })
      .expect(200);
    expect(renamed.body?.title).toBe('Documento Renomeado');

    // get
    const got = await request(app.getHttpServer())
      .get(`/documents/${docId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(got.body?.id).toBe(docId);

    // set template
    await request(app.getHttpServer())
      .put(`/documents/${docId}/template`)
      .set('Authorization', `Bearer ${token}`)
      .send({ templateKey: 'compact' })
      .expect(200);

    // update content (creates version)
    const firstContent = 'Conteudo A';
    await request(app.getHttpServer())
      .put(`/documents/${docId}/content`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: firstContent })
      .expect(200);

    const secondContent = 'Conteudo B';
    const updated = await request(app.getHttpServer())
      .put(`/documents/${docId}/content`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: secondContent })
      .expect(200);
    expect(updated.body?.content).toBe(secondContent);

    // versions
    const versions = await request(app.getHttpServer())
      .get(`/documents/${docId}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(versions.body)).toBe(true);
    expect(versions.body.length).toBeGreaterThanOrEqual(1);
    const versionId = versions.body[0].id as string;

    // restore version
    const restored = await request(app.getHttpServer())
      .post(`/documents/${docId}/versions/${versionId}/restore`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(restored.body?.content).toBeDefined();

    // archive
    const archived = await request(app.getHttpServer())
      .post(`/documents/${docId}/archive`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(archived.body?.isArchived).toBe(true);

    // unarchive
    const unarchived = await request(app.getHttpServer())
      .post(`/documents/${docId}/unarchive`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(unarchived.body?.isArchived).toBe(false);

    // duplicate
    const dup = await request(app.getHttpServer())
      .post(`/documents/${docId}/duplicate`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(dup.body?.id).toBeTruthy();
    const dupId = dup.body.id as string;

    // export pdf
    await request(app.getHttpServer())
      .get(`/documents/${docId}/export.pdf`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/pdf/)
      .expect(200);

    // delete both
    await request(app.getHttpServer())
      .delete(`/documents/${docId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/documents/${dupId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

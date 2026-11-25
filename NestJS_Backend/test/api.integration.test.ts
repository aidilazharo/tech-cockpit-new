import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

const folder = mkdtempSync(join(tmpdir(), 'atgv-nest-test-'));
process.env.DATABASE_URL = 'file:' + join(folder, 'test.db');
let app: INestApplication;
let client: { close: () => void };

describe('NestJS HTTP / SQLite integration', () => {
  beforeAll(async () => {
    const { Test } = await import('@nestjs/testing');
    const { AppModule } = await import('../src/main');
    const database = await import('../src/database');
    client = database.client;
    await database.migrate();
    await (await import('../src/cockpit')).migrateCockpit();
    const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    if (app) await app.close();
    if (client) client.close();
    rmSync(folder, { recursive: true, force: true });
  });
  it('accepts a valid task and returns it over HTTP', async () => {
    const api = request(app.getHttpServer());
    await api.get('/api/health').expect(200);
    const created = await api.post('/api/tasks').send({ title: 'Example' }).expect(201);
    expect(created.body.title).toBe('Example');
    const listed = await api.get('/api/tasks').expect(200);
    expect(listed.body.some((task: { id: number }) => task.id === created.body.id)).toBe(true);
    await api.delete('/api/tasks/' + created.body.id).expect(200);
  });
  it('persists scoped Cockpit records and rejects invalid input',async()=>{const api=request(app.getHttpServer());const body={name:'Demo application',description:'Synthetic record',status:'draft'};const row=await api.post('/api/v1/registers/applications').send(body).expect(201);await api.get('/api/v1/registers/applications').expect(200).expect(r=>{expect(r.body.some((x:{id:string})=>x.id===row.body.id)).toBe(true);});await api.put('/api/v1/registers/services/'+row.body.id).send(body).expect(404);await api.put('/api/v1/registers/applications/'+row.body.id).send({...body,status:'active'}).expect(200);await api.post('/api/v1/registers/applications').send({...body,name:''}).expect(400);await api.delete('/api/v1/registers/applications/'+row.body.id).expect(200);await api.get('/api/v1/registers/unknown').expect(404);});
  it('rejects invalid task input', async () => {
    await request(app.getHttpServer()).post('/api/tasks').send({ title: '' }).expect(400);
  });
});

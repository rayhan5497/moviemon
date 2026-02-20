process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('../app/app');
const { connectMongo, disconnectMongo } = require('../config/mongo');

describe('Auth', () => {
  let mongo;
  let app;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await connectMongo(mongo.getUri());
    app = createApp();
  });

  afterAll(async () => {
    await disconnectMongo();
    if (mongo) {
      await mongo.stop();
    }
  });

  it('registers and logs in', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Passw0rd!', name: 'Test' });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.token).toBeDefined();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Passw0rd!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});

const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should login a user', async () => {
    await User.create({ username: 'testuser2', email: 'test2@example.com', password: 'password' });
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'test2@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import truncate from '../util/truncate';
import User from '../../src/app/models/User';

import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await truncate();
  });

  it('Deve ser possível o cadastro', async () => {
    const userAttrs = await factory.attrs('UserForController');

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.status).toBe(201);
  });

  it('Não deve cadastrar com email invalido', async () => {
    const userAttrs = await factory.attrs('UserForController', {
      email: 'emailerrado@errado',
    });

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.status).toBe(400);
  });

  it('Não deve cadastrar com email undefined', async () => {
    const userAttrs = await factory.attrs('UserForController', {
      email: undefined,
    });

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.status).toBe(400);
  });

  it('Não deve ser possível cadastrar com email duplicado', async () => {
    const userCreated = await factory.create('User', {
      password: '112233',
    });

    const userAttrs = {
      nome: userCreated.name,
      email: userCreated.email,
      senha: userCreated.password,
      telefones: [{ numero: '855555555', ddd: '081' }],
    };

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.status).toBe(403);
  });

  it('Deve haver a criptografia da senha do usuário', async () => {
    const user = await factory.create('User', {
      password: '112233',
    });

    const compareHash = await bcrypt.compare('112233', user.password_hash);

    expect(compareHash).toBe(true);
  });
});

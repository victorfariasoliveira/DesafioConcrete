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

  it('Deve ser possível o cadastro', async () => {
    const userAttrs = await factory.attrs('UserForController');

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.body).toHaveProperty('id');
  });

  it('Não deve cadastrar o email invalido', async () => {
    const userAttrs = await factory.attrs('UserForController', {
      email: 'emailerrado@errado',
    });

    const response = await request(app)
      .post('/users')
      .send(userAttrs);

    expect(response.status).toBe(400);
  });

  it('Não deve ser possível cadastrar um email duplicado', async () => {
    const userAttrs = await factory.attrs('UserForController');

    const user = await request(app)
      .post('/users')
      .send(userAttrs);

    const response = await request(app)
      .post('/users')
      .send(user.body);

    expect(response.status).toBe(400);
  });

  it('Deve haver a criptografia da senha do usuário', async () => {
    const user = await factory.create('User', {
      password: '112233',
    });

    const compareHash = await bcrypt.compare('112233', user.password_hash);

    expect(compareHash).toBe(true);
  });
});

import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { addMinutes } from 'date-fns';
import app from '../../src/app';

import truncate from '../util/truncate';

import factory from '../factories';

import authConfig from '../../src/config/auth';


describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  beforeEach(async () => {
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

    user.last_login = addMinutes(user.last_login, 30);
    
    const compareHash = await bcrypt.compare('112233', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('Não deve buscar o usuário caso token não seja passado', async () => {
    const response = await request(app).get('/users/1');

    expect(response.status).toBe(401);
  });

  it('Não deve buscar o usuário caso o id esteja incorreto', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/users/j')
      .set('Authentication', user.dataValues.token);

    expect(response.status).toBe(404);
  });

  it('Não deve buscar o usuário caso o id não exista', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/users/2')
      .set('Authentication', user.dataValues.token);

    expect(response.status).toBe(404);
  });

  it('Não deve buscar o usuário caso o token não seja o do mesmo', async () => {
    const user = await factory.create('User');
    const user2 = await factory.attrs('User');

    const token = jwt.sign({ user2 }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    const response = await request(app)
      .get(`/users/${user.dataValues.id}`)
      .set('Authentication', `Bearer ${token}`);

    expect(response.status).toBe(401);
  });

  it('Não deve buscar o usuário caso seu ultimo acesso tenha sido a menos de 30 minutos', async () => {
    let user = await factory.create('User');

    user.dataValues.last_login = addMinutes(Date.now(), 20);

    const response = await request(app)
      .get(`/users/${user.dataValues.id}`)
      .set('Authentication', user.dataValues.token);

    expect(response.status).toBe(401);
  });

  it('Deve retornar o usuário', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/users/${user.dataValues.id}`)
      .set('Authentication', user.dataValues.token);

    expect(response.status).toBe(200);
  });
});

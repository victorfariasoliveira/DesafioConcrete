import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';

describe('User', () => {
  beforeAll(async () => {
    await truncate();
  });

  it('deve ser possível o cadastro', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        nome: 'Victor Farias de Oliveira',
        email: 'victorfariasteste@gamil.com',
        senha: '111111',
        telefones: [{ numero: 955555555, ddd: 810 }],
      });

    expect(response.body).toHaveProperty('id');
  });

  it('não deve ser possível cadastrar um email duplicado', async () => {
    await request(app)
      .post('/users')
      .send({
        nome: 'Victor Farias de Oliveira',
        email: 'victorfariasteste@gamil.com',
        senha: '111111',
        telefones: [{ numero: 955555555, ddd: 810 }],
      });

    const response = await request(app)
      .post('/users')
      .send({
        nome: 'Victor Farias de Oliveira',
        email: 'victorfariasteste@gamil.com',
        senha: '111111',
        telefones: [{ numero: 955555555, ddd: 810 }],
      });

    expect(response.status).toBe(400);
  });
});

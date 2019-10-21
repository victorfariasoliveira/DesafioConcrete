import request from 'supertest';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../src/app';

describe('Session', () => {

    beforeEach(async () => {
        await truncate();
      });

    afterEach(async () => {
        await truncate();
      });

    it('Deve logar o usuário cadastrado', async () => {
    const user = await factory.create('User');

    const req = {
      email: user.email,
      senha: user.password,
    };
    
    const response = await request(app)
      .post('/sessions')
      .send(req);
    
    expect(response.status).toBe(200);
    });

    it('Não deve logar o usuário informando campos errados', async () => {
        const user = await factory.create('User');
        
        const response = await request(app)
            .post('/sessions')
            .send(user.email);
        
            expect(response.status).toBe(400);
          });
});
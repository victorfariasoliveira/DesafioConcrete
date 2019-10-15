import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.signUp);
routes.get('/users', UserController.findOne)
routes.post('/sessions', SessionController.signIn)

export default routes;

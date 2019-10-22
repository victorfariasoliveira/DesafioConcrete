import faker from 'faker';
import { factory } from 'factory-girl';
import { subMinutes } from 'date-fns';

import User from '../src/app/models/User';

faker.locale = 'pt_BR';

factory.define('UserForController', User, {
  nome: faker.name.findName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  telefones: [{ numero: '855555555', ddd: '081' }],
});

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  last_login: subMinutes(Date.now(), 30),
  phone: [{ numero: '855555555', ddd: '081' }],
});

export default factory;

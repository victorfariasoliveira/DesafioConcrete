import faker from 'faker';
import { factory } from 'factory-girl';

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
  phone: [{ numero: '855555555', ddd: '081' }],
});

export default factory;

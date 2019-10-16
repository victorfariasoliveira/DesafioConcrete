import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

// arquivo do conexão com o banco de dados e carregamento de models

import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();

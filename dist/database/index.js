"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

// arquivo do conexão com o banco de dados e carregamento de models

var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Phone = require('../app/models/Phone'); var _Phone2 = _interopRequireDefault(_Phone);

const models = [_User2.default, _Phone2.default];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new (0, _sequelize2.default)(_database2.default);

    models.map(model => model.init(this.connection));
  }
}

exports. default = new Database();

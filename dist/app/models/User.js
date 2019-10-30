"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _Phone = require('./Phone'); var _Phone2 = _interopRequireDefault(_Phone);

class User extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        // apenas as colunas onde há interação do usuário
        name: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        password: _sequelize2.default.VIRTUAL,
        password_hash: _sequelize2.default.STRING,
        token: _sequelize2.default.STRING,
        last_login: _sequelize2.default.DATE,
        phones: _sequelize2.default.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    // hook para criptografar a senha
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await _bcryptjs2.default.hash(user.password, 8);
      }
    });

    // adiciona o token ao usuário
    this.addHook('beforeCreate', async user => {
      const { email } = user;
      const token = _jsonwebtoken2.default.sign({ email }, _auth2.default.secret, {
        expiresIn: _auth2.default.expiresIn,
      });
      user.token = `Bearer ${token}`;
    });

    this.addHook('beforeCreate', async user => {
      user.last_login = Date.now();
    });

    // adiciona os telefones do usuário
    this.addHook('afterCreate', async user => {
      if (user.phones) {
        await user.phones.forEach(async t => {
          await _Phone2.default.create({
            user_id: user.id,
            phone: t.numero,
            ddd: t.ddd,
          });
        });
      }
    });

    return this;
  }

  checkPassword(password) {
    return _bcryptjs2.default.compare(password, this.password_hash);
  }
}

exports. default = User;

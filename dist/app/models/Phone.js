"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Phone extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        // apenas as colunas onde há interação do usuário
        user_id: _sequelize2.default.INTEGER,
        ddd: _sequelize2.default.STRING,
        phone: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

exports. default = Phone;

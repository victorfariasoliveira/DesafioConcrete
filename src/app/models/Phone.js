import Sequelize, { Model } from 'sequelize';

class Phone extends Model {
  static init(sequelize) {
    super.init(
      {
        // apenas as colunas onde há interação do usuário
        user_id: Sequelize.INTEGER,
        ddd: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Phone;

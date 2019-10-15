import Sequelize, { Model } from 'sequelize';
import User from './User'

class Phone extends Model {
  static init(sequelize) {
    super.init(
      {
        // apenas as colunas onde há interação do usuário
        ddd: Sequelize.INTEGER,
        number: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

User.hasMany(Phone); // Will add userId to Task model
Phone.belongsTo(User); // Will also add userId to Task model

export default Phone;

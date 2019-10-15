import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // apenas as colunas onde há interação do usuário
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        token: Sequelize.STRING,
        phone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // hook para criptografar a senha
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // adiciona o token ao usuário
    this.addHook('beforeSave', async user => {
      const { email } = user;
      user.token = jwt.sign({ email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;

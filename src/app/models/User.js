import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Phone from './Phone';

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
        last_login: Sequelize.DATE,
        phones: Sequelize.VIRTUAL,
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
    this.addHook('beforeCreate', async user => {
      const { email } = user;
      const token = jwt.sign({ email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
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
          await Phone.create({
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
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;

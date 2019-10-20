import * as Yup from 'yup';
import { differenceInMinutes } from 'date-fns';
import User from '../models/User';

class UserController {
  async signUp(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string()
        .required()
        .min(6)
        .max(30),
      telefones: Yup.array().of(
        Yup.object().shape({
          numero: Yup.string()
            .required()
            .min(6)
            .max(10),
          ddd: Yup.string()
            .required()
            .min(2)
            .max(3),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A validação dos campos falhou' });
    }

    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail já existente' });
      }

      const user = await User.create({
        name: req.body.nome,
        email: req.body.email,
        password: req.body.senha,
        last_login: Date.now(),
        phones: req.body.telefones,
      });

      return res.json({
        id: user.id,
        data_criacao: user.dataValues.createdAt,
        data_atualizacao: user.dataValues.updatedAt,
        token: user.dataValues.token,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Houve problemas no servidor' });
    }
  }

  async find(req, res) {
    const token = req.headers.authentication;
    const param = req.params.id;

    if (!token) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    if (!param) {
      return res.status(400).json({ error: 'Id não informado' });
    }

    try {
      const user = await User.findByPk(param);

      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      if (user.token != token) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const minutesSinceLastLogin = differenceInMinutes(
        user.last_login,
        Date.now()
      );

      if (minutesSinceLastLogin < -30) {
        return res.status(401).json({ error: 'Sessão inválida' });
      }

      return res.json({
        id: user.id,
        nome: user.name,
        email: user.email,
        senha_hash: user.password_hash,
        token: user.token,
        ultimo_login: user.last_login,
        telefones: user.phones,
        data_criacao: user.createdAt,
        data_atualizacao: user.updatedAt,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Houve problemas no servidor' });
    }
  }
}

export default new UserController();

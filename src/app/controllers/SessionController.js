import * as Yup from 'yup'
import User from '../models/User';


class SessionController {
  async signIn(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'A validação dos campos falhou' });
    }

    try {
      const { email, senha } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
      }

      if (!(await user.checkPassword(senha))) {
        return res.status(401).json({ error: 'Usuário e/ou senha inválidos' });
      }

      // seta o ultimo login do usuário
      user.last_login = Date.now();
      user.save();

      const { id, createdAt, updatedAt, token } = user;

      return res.status(200).json({
        id,
        data_criacao: createdAt,
        data_atualizacao: updatedAt,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Houve problemas no servidor' });
    }
  }
}

export default new SessionController();

import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import * as Yup from 'yup'


class SessionController {
  async signIn(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({error : "A validação dos campos falhou"})
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: "Usuário e/ou senha inválidos" });
      }
  
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: "Usuário e/ou senha inválidos" });
      }
      
      // seta o ultimo login do usuário
      user.last_login = Date.now()
      user.save()

      const { id, createdAt, updatedAt, token } = user;
  
      return res.json({
          id,
          data_criacao: createdAt, 
          data_atualizacao: updatedAt,
          token
      });
      
    } catch (error) {
      return res.status(500).json({ error: 'Houve problemas no servidor' });
    }
  }
}

export default new SessionController();

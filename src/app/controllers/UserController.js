import User from '../models/User';
import * as Yup from 'yup'
import { differenceInMinutes } from 'date-fns'

class UserController {
  async signUp(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6).max(30),
      // phone: Yup.array().of({ddd: Yup.string().required(), number: Yup.string().required()})
    })

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({error : "A validação dos campos falhou"})
    }

    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'E-mail já existente' });
      }

      const user = await User.create({...req.body, last_login: Date.now()});

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
    const token = req.headers.authentication
    const param = req.params.id

    if(!token) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    if(!param) {
      return res.status(400).json({ error: "Id não informado" });
    }

    try {

      const user = await User.findByPk(param)

      if(!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      if(user.token != token) {
        return res.status(401).json({ error: "Não autorizado" });
      }
      
      const minutesSinceLastLogin = differenceInMinutes(user.last_login, Date.now())
      
      if (minutesSinceLastLogin < -30) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      return res.json({
        id: user.id,
        nome: user.name,
        email: user.email,
        senha_hash: user.password_hash,
        token: user.token,
        ultimo_login: user.last_login,
        telefones: user.phone,
        data_criacao: user.createdAt,
        data_atualizacao: user.updatedAt,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Houve problemas no servidor' });
    }
  }
}

export default new UserController();

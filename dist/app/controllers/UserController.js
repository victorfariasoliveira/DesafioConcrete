"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _datefns = require('date-fns');
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Phone = require('../models/Phone'); var _Phone2 = _interopRequireDefault(_Phone);

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
      const userExists = await _User2.default.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(403).json({ error: 'E-mail já existente' });
      }

      const user = await _User2.default.create({
        name: req.body.nome,
        email: req.body.email,
        password: req.body.senha,
        last_login: Date.now(),
        phones: req.body.telefones,
      });

      return res.status(201).json({
        id: user.id,
        data_criacao: user.dataValues.createdAt,
        data_atualizacao: user.dataValues.updatedAt,
        token: user.dataValues.token,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async find(req, res) {
    const token = req.headers.authentication;
    const param = req.params.id;

    if (!token) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
      const user = await _User2.default.findByPk(param);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (user.token !== token) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const minutesSinceLastLogin = _datefns.differenceInMinutes.call(void 0, 
        user.last_login,
        Date.now()
      );

      if (minutesSinceLastLogin < -30) {
        return res.status(401).json({ error: 'Sessão inválida' });
      }

      const phones = await _Phone2.default.findAll({
        where: { user_id: user.id },
        attributes: ['phone', 'ddd'],
      });

      return res.status(200).json({
        id: user.id,
        nome: user.name,
        email: user.email,
        senha_hash: user.password_hash,
        token: user.token,
        ultimo_login: user.last_login,
        telefones: phones,
        data_criacao: user.createdAt,
        data_atualizacao: user.updatedAt,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

exports. default = new UserController();

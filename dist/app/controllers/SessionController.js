"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);


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
      const user = await _User2.default.findOne({ where: { email } });

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
      return res.status(500).json(error);
    }
  }
}

exports. default = new SessionController();

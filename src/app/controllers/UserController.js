import User from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const { id, name, email, phone } = await User.create(req.body);

      return res.json({
        id,
        name,
        email,
        phone,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Problem with server' });
    }
  }
}

export default new UserController();

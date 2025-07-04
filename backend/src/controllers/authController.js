// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const { pool, poolConnect } = require('../db/connection');



const register = async (req, res) => {
  await poolConnect;

  const {
    name,
    email,
    password,
    state,
    city,
    department_id,
    position_id
  } = req.body;

  if (!name || !email || !password || !state || !city || !department_id || !position_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const emailCheck = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (emailCheck.recordset.length > 0) {
      return res.status(409).json({ message: 'E-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('name', name)
      .input('email', email)
      .input('password', hashedPassword)
      .input('state', state)
      .input('city', city)
      .input('department_id', department_id)
      .input('position_id', position_id)
      .query(`
        INSERT INTO Users (name, email, password, state, city, department_id, position_id)
        VALUES (@name, @email, @password, @state, @city, @department_id, @position_id)
      `);

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  await poolConnect;

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const userResult = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = userResult.recordset[0];

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'chave_secreta', // coloque no .env depois!
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department_id: user.department_id,
        position_id: user.position_id,
        state: user.state,
        city: user.city
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = { register, login };



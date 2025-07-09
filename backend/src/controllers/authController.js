// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const { pool, poolConnect } = require('../db/connection');
const jwt = require('jsonwebtoken');



const register = async (req, res) => {
  await poolConnect;

  const {
    name,
    email,
    password,
    password_confirmation,
    state,
    city,
    department_id,
    position_id
  } = req.body;


 if (!name || !email || !password || !password_confirmation || !state || !city || !department_id || !position_id) {
  return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
}

if (password !== password_confirmation) {
  return res.status(400).json({ message: 'As senhas não coincidem.' });
}

if (password.length < 8) {
  return res.status(400).json({ message: 'A senha senha precisa ser maior que 7 caractéres!' });
}

if (password.length > 10) {
  return res.status(400).json({ message: 'A senha senha precisa ser menor que 10 caractéres!' });
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
      { id: user.id, email: user.email }, process.env.JWT_SECRET || 'p5wd_5124', { expiresIn: '30d' });

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


const getUsers = async (req, res) => {
  await poolConnect;

  const userId = req.user.id; // vem do token via middleware verifyToken

  try {
    // Dados do usuário logado
    const currentUserResult = await pool.request()
      .input('id', userId)
      .query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.state,
          u.city,
          d.name AS department_name,
          p.name AS position_name
        FROM Users u
        JOIN Departments d ON u.department_id = d.id
        JOIN Position p ON u.position_id = p.id
        WHERE u.id = @id
      `);

    // Lista de todos os usuários
    const allUsersResult = await pool.request().query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.state,
        u.city,
        d.name AS department_name,
        p.name AS position_name
      FROM Users u
      JOIN Departments d ON u.department_id = d.id
      JOIN Position p ON u.position_id = p.id
    `);

    res.status(200).json({
      message: 'Usuário autenticado com sucesso.',
      currentUser: currentUserResult.recordset[0],
      allUsers: allUsersResult.recordset
    });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


const me = async (req, res) => {
  await poolConnect;

  const userId = req.user.id;

  try {
    const result = await pool.request()
      .input('id', userId)
      .query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.state,
          u.city,
          d.name AS department_name,
          p.name AS position_name
        FROM Users u
        JOIN Departments d ON u.department_id = d.id
        JOIN Position p ON u.position_id = p.id
        WHERE u.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao buscar dados do usuário logado:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


const updateUser = async (req, res) => {
  await poolConnect;

  const userId = parseInt(req.params.id); // ID do usuário a ser editado
  const {
    name,
    state,
    city,
    password,
    password_confirmation,
    department_id,
    position_id
  } = req.body;

  if (!name || !state || !city || !password || !password_confirmation || !department_id || !position_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }
  if (password !== password_confirmation) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }


  try {
    // Verifica se o usuário existe
    const existingUser = await pool.request()
      .input('id', userId)
      .query('SELECT * FROM Users WHERE id = @id');

    if (existingUser.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza os dados
    await pool.request()
      .input('id', userId)
      .input('name', name)
      .input('state', state)
      .input('city', city)
      .input('password', await bcrypt.hash(password, 10)) // Hash da nova senha
      .input('department_id', department_id)
      .input('position_id', position_id)
      .query(`
        UPDATE Users
        SET name = @name,
        state = @state,
        city = @city,
        password = @password,
        department_id = @department_id,
            position_id = @position_id
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


const deleteUserByEmail = async (req, res) => {
  await poolConnect;

  const { email, email_confirmation } = req.body;

  if (!email || !email_confirmation || email_confirmation !== email) {
    return res.status(400).json({ message: 'E-mail é obrigatório para exclusão e devem ser iguais' });
  }

  try {
    const result = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuário com esse e-mail não foi encontrado.' });
    }

    await pool.request()
      .input('email', email)
      .query('DELETE FROM Users WHERE email = @email');

    res.status(200).json({ message: `Usuário com email ${email} foi deletado com sucesso.` });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// GET http://localhost:3001/api/user?id=5&email=teste@email.comconst 
const getUserByIdOrEmail = async (req, res) => {
  await poolConnect;

  const { id, email } = req.query;

  try {
    let result;

    const request = pool.request();

    if (id) {
      request.input('id', parseInt(id));
      result = await request.query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.state,
          u.city,
          d.name AS department_name,
          p.name AS position_name
        FROM Users u
        JOIN Departments d ON u.department_id = d.id
        JOIN Position p ON u.position_id = p.id
        WHERE u.id = @id
      `);
    } else {
      request.input('email', email);
      result = await request.query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.state,
          u.city,
          d.name AS department_name,
          p.name AS position_name
        FROM Users u
        JOIN Departments d ON u.department_id = d.id
        JOIN Position p ON u.position_id = p.id
        WHERE u.email = @email
      `);
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ user: result.recordset[0] });
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }

}

module.exports = { register, login, me, getUsers, updateUser, deleteUserByEmail, getUserByIdOrEmail };



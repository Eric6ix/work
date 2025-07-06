const { pool, poolConnect } = require('../db/connection');


const registerDepartment = async (req, res) => {
  await poolConnect;

  const { name } = req.body;

 if (!name || name.length < 2) {
   return res.status(400).json({ message: 'O nome do departamento é obrigatório e deve ter pelo menos 2 caracteres.' });        
}
  try {
    const existingDepartment = await pool
      .request()
      .input('name', name)
      .query('SELECT * FROM Departments WHERE name = @name');

    if (existingDepartment.recordset.length > 0) {
      return res.status(409).json({ message: 'Esse departamento já existe ! ' });
    }

    await pool.request()
      .input('name', name)
      .query(`
        INSERT INTO Departments ( name )
        VALUES ( @name )
      `);

    res.status(201).json({ message: 'Departamento registrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};



const getDepartments = async (req, res) => {
  await poolConnect;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Obrigatório o login !' });
  }
  try {
    const allDepartmentsResult = await pool.request().query(`
      SELECT id, name FROM Departments
    `);

    res.status(200).json({
      message: 'Departamentos listados com sucesso.',
      allDepartments: allDepartmentsResult.recordset,
    });
  } catch (err) {
    console.error('Erro ao buscar departamentos:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};





const updateDepartments = async (req, res) => {
  await poolConnect;

  const departmentsId = parseInt(req.params.id); // ID do usuário a ser editado
  const { name } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }
    if (isNaN(departmentsId)) {
        return res.status(400).json({ message: 'ID inválido.' });
    } 

  try {
    // Verifica se o Departments existe
    const existingDepartments = await pool.request()
      .input('id', departmentsId)
      .query('SELECT * FROM Departments WHERE id = @id');

    if (existingDepartments.recordset.length === 0) {
      return res.status(404).json({ message: 'Departamento não encontrado.' });
    }

    // Atualiza os dados
    await pool.request()
      .input('id', departmentsId)
      .input('name', name)
      .query(`
        UPDATE Departments
        SET name = @name
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Departamento atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar Departamento:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};




const deleteDepartmentsByID = async (req, res) => {
  await poolConnect;

  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'O ID é obrigatório' });
  }

  try {
    const result = await pool.request()
    .input('id', id)
    .query('SELECT * FROM Departments WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Departamento com esse ID não foi encontrado.' });
    }

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Departments WHERE id = @id');

    res.status(200).json({ message: `Dpartamento com id ${id} foi deletado com sucesso.` });
  } catch (err) {
    console.error('Erro ao deletar Dpartamento:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


getUserByIdOrEmail = async (req, res) => {
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
module.exports = {registerDepartment, getDepartments, updateDepartments, deleteDepartmentsByID};
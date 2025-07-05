const { pool, poolConnect } = require('../db/connection');


const registerPosition = async (req, res) => {
  await poolConnect;

  const { name } = req.body;

 if (!name || name.length < 2) {
   return res.status(400).json({ message: 'O nome do cargo é obrigatório e deve ter pelo menos 2 caracteres.' });        
}
  try {
    const existingPosition = await pool
      .request()
      .input('name', name)
      .query('SELECT * FROM Position WHERE name = @name');

    if (existingPosition.recordset.length > 0) {
      return res.status(409).json({ message: 'Esse cargo já existe ! ' });
    }

    await pool.request()
      .input('name', name)
      .query(`
        INSERT INTO Position ( name )
        VALUES ( @name )
      `);

    res.status(201).json({ message: 'Cargo registrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};



const getPosition = async (req, res) => {
  await poolConnect;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Obrigatório o login !' });
  }
  try {
    const allPositionResult = await pool.request().query(`
      SELECT id, name FROM Position
    `);

    res.status(200).json({
      message: 'Departamentos listados com sucesso.',
      allPosition: allPositionResult.recordset,
    });
  } catch (err) {
    console.error('Erro ao buscar cargo:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};





const updatePosition = async (req, res) => {
  await poolConnect;

  const positionId = parseInt(req.params.id); // ID do usuário a ser editado
  const { name } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }
    if (isNaN(positionId)) {
        return res.status(400).json({ message: 'ID inválido.' });
    } 

  try {
    // Verifica se o Departments existe
    const existingPosition = await pool.request()
      .input('id', positionId)
      .query('SELECT * FROM Position WHERE id = @id');

    if (existingPosition.recordset.length === 0) {
      return res.status(404).json({ message: 'cargo não encontrado.' });
    }

    // Atualiza os dados
    await pool.request()
      .input('id', positionId)
      .input('name', name)
      .query(`
        UPDATE Position
        SET name = @name
        WHERE id = @id
      `);

    res.status(200).json({ message: 'cargo atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar cargo:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};




const deletePositionByID = async (req, res) => {
  await poolConnect;

  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'O ID é obrigatório' });
  }

  try {
    const result = await pool.request()
    .input('id', id)
    .query('SELECT * FROM Position WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Cargo com esse ID não foi encontrado.' });
    }

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Position WHERE id = @id');

    res.status(200).json({ message: `Cargo com id ${id} foi deletado com sucesso.` });
  } catch (err) {
    console.error('Erro ao deletar cargo:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = {registerPosition, getPosition, updatePosition, deletePositionByID};
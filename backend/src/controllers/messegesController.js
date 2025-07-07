const { pool, poolConnect } = require('../db/connection');


const registerMessages = async (req, res) => {
  await poolConnect;

  const { title, content } = req.body;

 if (!title || title.length < 2) {
   return res.status(400).json({ message: 'O Título da mensagem é obrigatório e deve ter pelo menos 2 caracteres.' });        
}

 if (!content || content.length < 5) {
  return res.status(400).json({ message: 'A mensagem é obrigatória e deve ter pelo menos 5 caracteres.' });        
}

  try {

    await pool.request()
      .input('title', title)
      .input('content', content)
      .query(`
        INSERT INTO Messages ( title, content )
        VALUES ( @title, @content )
      `);

    res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};



const getMessages = async (req, res) => {
  await poolConnect;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Obrigatório o login !' });
  }
  try {
    const allMessages = await pool.request().query(`
      SELECT id, name FROM Messages
    `);

    res.status(200).json({
      message: 'Mensagems listadas com sucesso.',
      allMessages: allMessages.recordset,
    });
  } catch (err) {
    console.error('Erro ao buscar Mensgems:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};



const deleteMessagesByID = async (req, res) => {
  await poolConnect;

  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'O ID é obrigatório' });
  }

  try {
    const result = await pool.request()
    .input('id', id)
    .query('SELECT * FROM Messages WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Mensagem com esse ID não foi encontrado.' });
    }

    await pool.request()
      .input('id', id)
      .query('DELETE FROM Messages WHERE id = @id');

    res.status(200).json({ message: `Mensagem com id ${id} foi deletado com sucesso.` });
  } catch (err) {
    console.error('Erro ao deletar Mensagem:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


getMessagesById = async (req, res) => {
  await poolConnect;

  const { id } = req.query;

  try {
    let result;

    const request = pool.request();

    if (id) {
      request.input('id', parseInt(id));
      result = await request.query(`
        SELECT 
          id,
          title,
          content,
          created_at
        FROM Messages
      `);
    } 
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Mensagem não encontrado.' });
    }

    res.status(200).json({ user: result.recordset[0] });
  } catch (err) {
    console.error('Erro ao buscar Mensagem:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }

}
module.exports = {registerMessages, getMessages, deleteMessagesByID};
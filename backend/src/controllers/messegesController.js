const { pool, poolConnect } = require('../db/connection');
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registerMessages = async (req, res) => {
  await poolConnect;

  const {
    title,
    content,
    position_id,
    department_id,
    target_user_id

  } = req.body;

  const createdBy = req.user.id;

  if (!title || title.length < 2) {
    return res.status(400).json({ message: 'Título inválido.' });
  }

  if (!content || content.length < 5) {
    return res.status(400).json({ message: 'Conteúdo inválido.' });
  }

  try {
    // 1. Salva mensagem
    const messageResult = await pool.request()
      .input('title', title)
      .input('content', content)
      .input('created_by', createdBy)
      .query(`
        INSERT INTO Messages (title, content, created_by)
        OUTPUT INSERTED.id
        VALUES (@title, @content, @created_by)
      `);

    const messageId = messageResult.recordset[0].id;

    // 2. Processa arquivos (se houver)
    const attachments = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        attachments.push({
          filename: file.originalname,
          content: fs.readFileSync(file.path)
        });
      }
    }

    // 3. Envio por target_user_id
    if (target_user_id) {
      // Busca email do usuário
      const result = await pool.request()
        .input('user_id', target_user_id)
        .query(`SELECT email FROM Users WHERE id = @user_id`);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const userEmail = result.recordset[0].email;

      // Salva destinatário no banco
      await pool.request()
        .input('message_id', messageId)
        .input('user_id', target_user_id)
        .query(`
          INSERT INTO MessageRecipients (message_id, user_id)
          VALUES (@message_id, @user_id)
        `);

      // Envia email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: title,
        text: content,
        attachments
      });

      return res.status(201).json({ message: 'Mensagem enviada para o usuário específico com sucesso.' });
    }

    // 4. Envio por cargo e departamento
    else if (position_id && department_id) {
      const users = await pool.request()
        .input('position_id', position_id)
        .input('department_id', department_id)
        .query(`
          SELECT id, email FROM Users
          WHERE position_id = @position_id AND department_id = @department_id
        `);

      if (users.recordset.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado com o cargo e departamento informados.' });
      }

      for (const user of users.recordset) {
        // Salva no banco
        await pool.request()
          .input('message_id', messageId)
          .input('user_id', user.id)
          .query(`
            INSERT INTO MessageRecipients (message_id, user_id)
            VALUES (@message_id, @user_id)
          `);

        // Envia email
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: title,
          text: content,
          attachments
        });
      }

      return res.status(201).json({ message: 'Mensagem enviada para os usuários do cargo/departamento.' });
    }

    // 5. Nenhum destinatário definido
    else {
      return res.status(400).json({ message: 'Destinatário(s) não especificado(s).' });
    }

  } catch (err) {
    console.error('Erro ao registrar mensagem:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = { registerMessages };





const getMessages = async (req, res) => {
  await poolConnect;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "Obrigatório o login !" });
  }
  try {
    const allMessages = await pool.request().query(`
      SELECT id, name FROM Messages
    `);

    res.status(200).json({
      message: "Mensagems listadas com sucesso.",
      allMessages: allMessages.recordset,
    });
  } catch (err) {
    console.error("Erro ao buscar Mensgems:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const deleteMessagesByID = async (req, res) => {
  await poolConnect;

  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "O ID é obrigatório" });
  }

  try {
    const result = await pool
      .request()
      .input("id", id)
      .query("SELECT * FROM Messages WHERE id = @id");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Mensagem com esse ID não foi encontrado." });
    }

    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM Messages WHERE id = @id");

    res
      .status(200)
      .json({ message: `Mensagem com id ${id} foi deletado com sucesso.` });
  } catch (err) {
    console.error("Erro ao deletar Mensagem:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

getMessagesById = async (req, res) => {
  await poolConnect;

  const { id } = req.query;

  try {
    let result;

    const request = pool.request();

    if (id) {
      request.input("id", parseInt(id));
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
      return res.status(404).json({ message: "Mensagem não encontrado." });
    }

    res.status(200).json({ user: result.recordset[0] });
  } catch (err) {
    console.error("Erro ao buscar Mensagem:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};
module.exports = { registerMessages, getMessages, deleteMessagesByID };

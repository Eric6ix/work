const { pool, poolConnect } = require("../db/connection");

require("dotenv").config();
const nodemailer = require('nodemailer');
require('dotenv').config();

const registerMessages = async (req, res) => {
  await poolConnect;

  const {
    title,
    content,
    position_id,
    department_id,
    target_user_id,
  } = req.body;

  const createdBy = req.user.id;

  if (!title || title.length < 2) {
    return res.status(400).json({ message: 'Título obrigatório (mín. 2 caracteres).' });
  }

  if (!content || content.length < 5) {
    return res.status(400).json({ message: 'Conteúdo obrigatório (mín. 5 caracteres).' });
  }

  try {
    // 1. Inserir mensagem
    const result = await pool.request()
      .input('title', title)
      .input('content', content)
      .input('created_by', createdBy)
      .query(`
        INSERT INTO Messages (title, content, created_by)
        OUTPUT INSERTED.id
        VALUES (@title, @content, @created_by)
      `);

    const messageId = result.recordset[0].id;
    let recipients = [];

    // 2. Determinar os destinatários
    if (target_user_id) {
      // Um destinatário específico
      recipients = await pool.request()
        .input('user_id', target_user_id)
        .query(`SELECT id, email FROM Users WHERE id = @user_id`);
    } else if (position_id && department_id) {
      // Filtrando por cargo e departamento
      const users = await pool.request()
        .input('position_id', position_id)
        .input('department_id', department_id)
        .query(`
          SELECT id, email FROM Users
          WHERE position_id = @position_id AND department_id = @department_id
        `);
      recipients = users.recordset;
    } else {
      return res.status(400).json({ message: 'Você deve informar o destinatário.' });
    }

    // // 3. Inserir na tabela MessageRecipients e enviar e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Ex: developerdisbrava@gmail.com
        pass: process.env.EMAIL_PASS, // Ex: pjuyumwcngkiepyp
      },
    });

    for (const user of recipients) {
      // Salvar relação da mensagem com o usuário
      await pool.request()
        .input('message_id', messageId)
        .input('user_id', user.id)
        .query(`
          INSERT INTO MessageRecipients (message_id, user_id)
          VALUES (@message_id, @user_id)
        `);

      // Enviar e-mail
      await transporter.sendMail({
        from: `"Disbrava Ford" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `[Nova Mensagem] ${title}`,
        html: `<h3>${title}</h3><p>${content}</p>`,
      });
    }

    res.status(201).json({ message: 'Mensagem registrada e enviada com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar mensagem:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};




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

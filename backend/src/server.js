// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { poolConnect, pool, sql } = require('./db/connection');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.get('/test-db', async (req, res) => {
  try {
    await poolConnect; // garante que a conexão foi estabelecida
    const result = await pool.request().query('SELECT GETDATE() AS dataAtual');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
    res.status(500).json({ error: 'Erro ao conectar no banco de dados' });
  }
});

module.exports = app;

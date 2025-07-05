// backend/server.js
const express = require('express');
const cors = require('cors');
const { poolConnect, pool } = require('./db/connection');
const authRoutes = require('./routes/authRoutes');
const departmentsRoutes = require('./routes/DepartmentsRoutes');
const positionRoutes = require('./routes/positionRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// teste de api
app.get('/teste', (res) => {
  res.send('API funcionando!');
});


// teste de bando de dados SSMS
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



// rotas de entrada inicial
app.use('/api/auth', authRoutes);


// rotas protegidas "apenas user cadastrados podem acessar"
app.use('/api/departments', departmentsRoutes);
app.use('/api/positions', positionRoutes);
module.exports = app;

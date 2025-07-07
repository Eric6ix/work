// backend/routes/DepartmentsRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { deleteMessagesByID, getMessages, registerMessages } = require('../controllers/messegesController');


// Rotas verificadas para o usuário autenticado
router.get('/', verifyToken, getMessages);
router.post('/register', verifyToken, registerMessages);
router.delete('/delet/:id', verifyToken, deleteMessagesByID);

module.exports = router;
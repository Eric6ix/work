// backend/routes/DepartmentsRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { deleteMessagesByID, getMessages, registerMessages } = require('../controllers/messegesController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


// Rotas verificadas para o usuário autenticado
router.get('/', verifyToken, getMessages);
router.post('/register', verifyToken, upload.array('attachments'), registerMessages);
router.delete('/delet/:id', verifyToken, deleteMessagesByID);

module.exports = router;
// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, me, getUsers} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', register);
router.post('/', login);


// Rotas verificadas para o usuário autenticado
router.get('/me',verifyToken, me);
router.get('/dashbord',verifyToken, getUsers);

module.exports = router;

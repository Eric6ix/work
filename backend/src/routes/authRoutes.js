// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, me, getUsers, updateUser, deleteUserByEmail, getUserByIdOrEmail } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
// const checkRole = require('../middlewares/checkRole');



router.post('/register', register);
router.post('/', login);


// Rotas verificadas para o usuário autenticado
router.get('deshbord/me', verifyToken, me);
router.get('/dashbord', verifyToken, getUsers);
router.get('/dashbord/search', verifyToken, getUserByIdOrEmail);
router.get('/dashbord', verifyToken, getUsers);
router.put('/dashbord/editUser/:id', verifyToken, updateUser);
router.delete('/dashbord/deletUser', /*checkRole([1], [1]),*/ verifyToken, deleteUserByEmail);
module.exports = router;

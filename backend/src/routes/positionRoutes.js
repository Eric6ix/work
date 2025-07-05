const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { deletePositionByID, getPosition, registerPosition, updatePosition } = require('../controllers/positionController');


// Rotas verificadas para o usuário autenticado
router.get('/',verifyToken, getPosition);
router.post('/register', verifyToken, registerPosition);
router.put('/update/:id', verifyToken, updatePosition);
router.delete('/delet/:id', verifyToken, deletePositionByID);

module.exports = router;
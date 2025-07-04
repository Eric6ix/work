// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, me} = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', register);
router.post('/', login);
router.get('/me',verifyToken, me);

module.exports = router;

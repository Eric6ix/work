// backend/routes/DepartmentsRoutes.js
const express = require('express');
const router = express.Router();
const { deleteDepartmentsByID, getDepartments, registerDepartment, updateDepartments } = require('../controllers/departmentsController');
const verifyToken = require('../middlewares/verifyToken');


// Rotas verificadas para o usuário autenticado
router.get('/',verifyToken, getDepartments);
router.post('/register', verifyToken, registerDepartment);
router.put('/update/:id', verifyToken, updateDepartments);
router.delete('/delet/:id', verifyToken, deleteDepartmentsByID);

module.exports = router;

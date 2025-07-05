// backend/routes/DepartmentsRoutes.js
const express = require('express');
const router = express.Router();
const { deleteDepartmentsByID, getDepartments, registerDepartment, updateDepartments } = require('../controllers/departmentsController');
// const verifyToken = require('../middlewares/verifyToken');


// Rotas verificadas para o usuário autenticado
router.get('/', getDepartments);
router.post('/register', registerDepartment);
router.put('/update/:id', updateDepartments);
router.delete('/delet/:id', deleteDepartmentsByID);

module.exports = router;

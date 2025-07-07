// middlewares/checkRole.js
const jwt = require('jsonwebtoken');
const { pool, poolConnect } = require('../db/connection');

require('dotenv').config();

const checkRole = (allowedDepartments = [], allowedPositions = []) => {
  return async (req, res, next) => {
    await poolConnect;

    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const userId = decoded.id;

      const result = await pool.request()
        .input('id', userId)
        .query(`
          SELECT department_id, position_id 
          FROM Users 
          WHERE id = @id
        `);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const user = result.recordset[0];

      const hasDepartmentAccess =
        allowedDepartments.length === 0 || allowedDepartments.includes(user.department_id);

      const hasPositionAccess =
        allowedPositions.length === 0 || allowedPositions.includes(user.position_id);

      if (!hasDepartmentAccess || !hasPositionAccess) {
        return res.status(403).json({ message: 'Acesso negado. Cargo ou departamento não autorizado.' });
      }

      next();
    } catch (err) {
      console.error('Erro na verificação de cargo/departamento:', err);
      res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  };
};

module.exports = checkRole;

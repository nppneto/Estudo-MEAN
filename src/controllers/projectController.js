const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Ativo a rota do middleware
router.use(authMiddleware);

router.get('/', (req, res) => {
    // O usuário sendo autenticado, retorna o true e o userId do usuário logado
    res.send({ 'ok': true, user: req.userId });
});

module.exports = app => app.use('/projects', router);
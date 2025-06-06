const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.listarPerguntas);
router.post('/adicionar', adminController.adicionarPergunta);
router.post('/deletar/:id', adminController.excluirPergunta);

module.exports = router;

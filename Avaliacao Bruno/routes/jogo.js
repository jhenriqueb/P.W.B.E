const express = require('express');
const router = express.Router();
const jogoController = require('../controllers/jogoController');

router.get('/', jogoController.sortearPergunta);
router.post('/responder', jogoController.verificarResposta);

module.exports = router;

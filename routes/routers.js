const express = require('express')
const router = express.Router()
const JogoController = require('../controllers/JogoController')
const AdminController = require('../controllers/AdminController')

router.get('/', JogoController.home)
router.get('/jogo', JogoController.iniciarJogo)
router.post('/verificar', JogoController.verificarResposta)
router.get('/resultado', JogoController.resultado)
router.post('/reiniciar-jogo', JogoController.reiniciarJogo)

router.get('/admin', AdminController.index)
router.post('/admin/adicionar', AdminController.adicionarPergunta)
router.post('/admin/deletar/:id', AdminController.deletarPergunta)
router.post('/admin/editar/:id', AdminController.editarPergunta)
router.post('/admin/reiniciar', AdminController.reiniciarEstatisticas)

module.exports = router
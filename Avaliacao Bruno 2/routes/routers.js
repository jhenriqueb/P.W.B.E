const express = require('express')
const router = express.Router()
const { getPerguntas, addPergunta, deletePergunta, getPerguntaById } = require('../models/perguntas')

router.get('/', (req, res) => {
  res.render('pages/home')
})

router.get('/jogo', (req, res) => {
  const perguntas = getPerguntas()
  if (perguntas.length === 0) {
    return res.redirect('/')
  }
  const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)]
  res.render('pages/jogo', { pergunta })
})

router.get('/resultado', (req, res) => {
  res.render('pages/resultado')
})

router.get('/admin', (req, res) => {
  const perguntas = getPerguntas()
  res.render('pages/admin', { perguntas })
})

router.post('/admin/adicionar', (req, res) => {
  const { pergunta, alternativa1, alternativa2, alternativa3, correta } = req.body
  addPergunta({ pergunta, alternativa1, alternativa2, alternativa3, correta: parseInt(correta) })
  res.redirect('/admin')
})

router.post('/admin/deletar/:id', (req, res) => {
  const id = parseInt(req.params.id)
  deletePergunta(id)
  res.redirect('/admin')
})

module.exports = router
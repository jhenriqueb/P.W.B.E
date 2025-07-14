const express = require('express')
const router = express.Router()

const operacaoController = require('../controllers/operacao.controller')
const usuarioController = require('../controllers/usuario.controller')

/* ----- Rotas públicas ----- */
router.get('/', function (req, res) {
  res.render('pages/home',
    {
      title: 'Home',
      paginaAtiva: 'home',
      usuario: req.session.usuario
    }
  );
});

// Rotas de autenticação
router.get('/user/login', function (req, res) {
  if (req.session.usuario) {
    return res.redirect('/')
  }
  res.render('pages/login',
    {
      title: 'Login',
      paginaAtiva: 'login'
    }
  );
});

router.get('/user/cadastro', function (req, res) {
  if (req.session.usuario) {
    return res.redirect('/')
  }
  res.render('pages/cadastro',
    {
      title: 'Cadastro',
      paginaAtiva: 'cadastro'
    }
  );
});

router.post('/user/login', usuarioController.login)
router.post('/user/cadastro', usuarioController.save)
router.get('/user/logout', usuarioController.logout)

/* ----- Rotas protegidas (requerem autenticação) ----- */
router.get('/nova_operacao', usuarioController.mustBeAuthenticated, function (req, res) {
  res.render('pages/nova_operacao',
    {
      title: 'Nova Operação',
      paginaAtiva: 'operacao',
      usuario: req.session.usuario
    }
  );
})

router.get('/operacoes', usuarioController.mustBeAuthenticated, operacaoController.getUserOperations)

router.post('/salvar_operacao', usuarioController.mustBeAuthenticated, operacaoController.save)

module.exports = router
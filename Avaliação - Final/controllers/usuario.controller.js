const CadastroUsuario = require('../models/usuario');

exports.save = function (req, res) {
    const user = new CadastroUsuario(req.body)
    user.validate()

    if (user.errors.length > 0) {
        return res.send(user.errors)
    } else {
        user.create()
            .then((result) => {
                res.send(`Usuário cadastrado com sucesso com o id: ${result}`)
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }
}

exports.login = function (req, res) {
    const user = new CadastroUsuario(req.body)
    user.validateLogin()

    if (user.errors.length > 0) {
        return res.send(user.errors)
    } else {
        user.login()
            .then((result) => {
                req.session.usuario = {
                    username: result.username,
                    id: result.id
                }
                req.session.save(function () {
                    res.redirect("/")
                })
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect("/")
    })
}

exports.mustBeAuthenticated = function (req, res, next) {
    if (req.session.usuario) {
        return next()
    } else {
        return res.redirect('/user/entrar')
    }
}
const Operacao = require('../models/operacao')

exports.save = function (req, res) {
    const operacao = new Operacao(req.body)
    operacao.validate()
    if (operacao.errors.length > 0) {
        return res.send(operacao.errors)
    } else {
        operacao.create()
            .then((result) => {
                res.send(`Operação salva com sucesso com o id: ${result}`)
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }
}

exports.getUserOperations = function (req, res) {
    const operacao = new Operacao({}, req.session.usuario.id)
    operacao.readUserOperations()
        .then((result) => {
            res.render('pages/operacao/myoperations', {
                title: 'Minhas Operações',
                operations: result
            })
        })
        .catch((error) => {
            res.status(500).send(error)
        })
}
const { getPerguntas, addPergunta, deletePergunta } = require('../models/perguntas')
const { getEstatisticas, reiniciarEstatisticas } = require('../models/estatisticas')

class AdminController {
    static async index(req, res) {
        try {
            const perguntas = await getPerguntas()
            const estatisticas = await getEstatisticas()
            res.render('pages/admin', { perguntas, estatisticas })
        } catch (error) {
            console.error('Erro ao carregar página admin:', error)
            res.status(500).send('Erro ao carregar página')
        }
    }

    static async adicionarPergunta(req, res) {
        try {
            const { pergunta, alternativa1, alternativa2, alternativa3, correta } = req.body
            const options = [alternativa1, alternativa2, alternativa3]
            const correctAnswerText = options[parseInt(correta) - 1]

            await addPergunta({ 
                question: pergunta,
                correctAnswer: correctAnswerText,
                options: options,
                difficulty: 1
            })
            res.redirect('/admin')
        } catch (error) {
            console.error('Erro ao adicionar pergunta:', error)
            res.status(500).send('Erro ao adicionar pergunta')
        }
    }

    static async deletarPergunta(req, res) {
        try {
            const id = parseInt(req.params.id)
            await deletePergunta(id)
            res.redirect('/admin')
        } catch (error) {
            console.error('Erro ao deletar pergunta:', error)
            res.status(500).send('Erro ao deletar pergunta')
        }
    }

    static async reiniciarEstatisticas(req, res) {
        try {
            await reiniciarEstatisticas()
            res.redirect('/')
        } catch (error) {
            console.error('Erro ao reiniciar estatísticas:', error)
            res.status(500).send('Erro ao reiniciar estatísticas')
        }
    }
}

module.exports = AdminController 
const Question = require('../models/Question');
const Estatistica = require('../models/Estatistica');

class AdminController {
    static async index(req, res) {
        try {
            const perguntas = await Question.findAll();
            const estatisticas = await Estatistica.findOne();
            res.render('pages/admin', { perguntas, estatisticas: estatisticas.toJSON() });
        } catch (error) {
            console.error('Erro ao carregar página admin:', error);
            res.status(500).send('Erro ao carregar página');
        }
    }

    static async adicionarPergunta(req, res) {
        try {
            const { pergunta, alternativa1, alternativa2, alternativa3, correta } = req.body;
            const options = [alternativa1, alternativa2, alternativa3];
            const correctAnswerText = options[parseInt(correta) - 1];

            await Question.create({ 
                question: pergunta,
                correctAnswer: correctAnswerText,
                options: options,
                difficulty: 1
            });
            res.redirect('/admin');
        } catch (error) {
            console.error('Erro ao adicionar pergunta:', error);
            res.status(500).send('Erro ao adicionar pergunta: ' + error.message);
        }
    }

    static async deletarPergunta(req, res) {
        try {
            const id = parseInt(req.params.id);
            await Question.delete(id);
            res.redirect('/admin');
        } catch (error) {
            console.error('Erro ao deletar pergunta:', error);
            res.status(500).send('Erro ao deletar pergunta: ' + error.message);
        }
    }

    static async reiniciarEstatisticas(req, res) {
        try {
            await Estatistica.reset();
            res.redirect('/');
        } catch (error) {
            console.error('Erro ao reiniciar estatísticas:', error);
            res.status(500).send('Erro ao reiniciar estatísticas');
        }
    }

    static async editarPergunta(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { pergunta, alternativa1, alternativa2, alternativa3, correta } = req.body;

            
            const perguntaExistente = await Question.findById(id);
            if (!perguntaExistente) {
                return res.status(404).send('Pergunta não encontrada');
            }

            
            const options = [alternativa1, alternativa2, alternativa3];
            const correctAnswer = options[parseInt(correta) - 1];

            (id, {
                question: pergunta,
                options,
                correctAnswer,
                difficulty: perguntaExistente.difficulty 
            });

            res.redirect('/admin');
        } catch (error) {
            console.error('Erro ao editar pergunta:', error);
            res.status(500).send('Erro ao editar pergunta');
        }
    }
}

module.exports = AdminController; 
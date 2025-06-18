const Question = require('../models/Question');
const Estatistica = require('../models/Estatistica');

class JogoController {
    static async home(req, res) {
        try {
            const estatisticas = await Estatistica.findOne();
            if (!req.session.perguntasRespondidas) {
                req.session.perguntasRespondidas = [];
            }
            res.render('pages/home', { estatisticas: estatisticas.toJSON() });
        } catch (error) {
            console.error('Erro ao carregar página inicial:', error);
            res.status(500).send('Erro ao carregar página');
        }
    }

    static async iniciarJogo(req, res) {
        try {
            console.log('Iniciando jogo...');
            
            
            if (!req.session.perguntasRespondidas) {
                req.session.perguntasRespondidas = [];
            }
            
            const perguntas = await Question.findAll();
            console.log('Perguntas obtidas:', perguntas);

            if (!perguntas || perguntas.length === 0) {
                console.log('Nenhuma pergunta encontrada');
                return res.redirect('/');
            }

            console.log('Perguntas respondidas:', req.session.perguntasRespondidas);
            const perguntasDisponiveis = perguntas.filter(p => 
                !req.session.perguntasRespondidas.includes(p.id)
            );
            console.log('Perguntas disponíveis:', perguntasDisponiveis);

            if (perguntasDisponiveis.length === 0) {
                console.log('Todas as perguntas foram respondidas');
                const estatisticas = await Estatistica.findOne();
                return res.render('pages/fim-quiz', { estatisticas: estatisticas.toJSON() });
            }

            const pergunta = perguntasDisponiveis[Math.floor(Math.random() * perguntasDisponiveis.length)];
            console.log('Pergunta selecionada:', pergunta);
            const estatisticas = await Estatistica.findOne();
            res.render('pages/jogo', { pergunta, estatisticas: estatisticas.toJSON() });
        } catch (error) {
            console.error('Erro detalhado ao iniciar jogo:', error);
            res.status(500).send('Erro ao iniciar jogo: ' + error.message);
        }
    }

    static async verificarResposta(req, res) {
        try {
            
            if (!req.session.perguntasRespondidas) {
                req.session.perguntasRespondidas = [];
            }

            const { perguntaId, resposta } = req.body;
            console.log('Verificando resposta:', { perguntaId, resposta });
            
            const pergunta = await Question.findById(parseInt(perguntaId));
            console.log('Pergunta encontrada:', pergunta);
            
            if (!pergunta) {
                console.log('Pergunta não encontrada');
                return res.redirect('/jogo');
            }

            const acertou = resposta === pergunta.correctAnswer;
            console.log('Resposta:', { resposta, correctAnswer: pergunta.correctAnswer, acertou });
            
            await Estatistica.update(acertou);
            
            if (!req.session.perguntasRespondidas.includes(pergunta.id)) {
                req.session.perguntasRespondidas.push(pergunta.id);
            }

            const estatisticas = await Estatistica.findOne();
            res.render('pages/resultado', { acertou, pergunta, estatisticas: estatisticas.toJSON() });
        } catch (error) {
            console.error('Erro ao verificar resposta:', error);
            res.status(500).send('Erro ao verificar resposta: ' + error.message);
        }
    }

    static async resultado(req, res) {
        try {
            const estatisticas = await Estatistica.findOne();
            res.render('pages/resultado', { estatisticas: estatisticas.toJSON() });
        } catch (error) {
            console.error('Erro ao carregar resultado:', error);
            res.status(500).send('Erro ao carregar resultado: ' + error.message);
        }
    }

    static reiniciarJogo(req, res) {
        req.session.perguntasRespondidas = [];
        res.redirect('/jogo');
    }
}

module.exports = JogoController; 
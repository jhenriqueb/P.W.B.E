const db = require('../db/conn');

let pontuacao = 0;

exports.sortearPergunta = async (req, res) => {
  const result = await db.query('SELECT * FROM perguntas');
  const perguntas = result.rows;
  const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];
  res.render('jogo', { pergunta, css: 'jogo' });
};

exports.verificarResposta = async (req, res) => {
  const { resposta, correta, perguntaId } = req.body;
  const acertou = parseInt(resposta) === parseInt(correta);
  if (acertou) pontuacao++;

  const result = await db.query('SELECT * FROM perguntas WHERE id = $1', [perguntaId]);
  const pergunta = result.rows[0];

  res.render('resultado', {
    pergunta,
    respostaSelecionada: parseInt(resposta),
    acertou,
    pontuacao,
    css: 'resultado'
  });
};

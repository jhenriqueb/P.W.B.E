const db = require('../db/conn');

exports.listarPerguntas = async (req, res) => {
  const result = await db.query('SELECT * FROM perguntas');
  res.render('admin', { perguntas: result.rows, css: 'admin' });
};

exports.adicionarPergunta = async (req, res) => {
  const { pergunta, alternativa1, alternativa2, alternativa3, correta } = req.body;
  await db.query(
    'INSERT INTO perguntas (pergunta, alternativa1, alternativa2, alternativa3, correta) VALUES ($1, $2, $3, $4, $5)',
    [pergunta, alternativa1, alternativa2, alternativa3, parseInt(correta)]
  );
  res.redirect('/admin');
};

exports.excluirPergunta = async (req, res) => {
  await db.query('DELETE FROM perguntas WHERE id = $1', [req.params.id]);
  res.redirect('/admin');
};

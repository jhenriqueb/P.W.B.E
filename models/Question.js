const pool = require('../db/database');

const Question = {};

// Métodos CRUD
Question.createQuestion = async (questionData) => {
    const { question, correctAnswer, options, difficulty } = questionData;
    try {
        const result = await pool.query(
            'INSERT INTO "Questions" (question, "correctAnswer", options, difficulty) VALUES ($1, $2, $3, $4) RETURNING *;',
            [question, correctAnswer, JSON.stringify(options), difficulty]
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Erro ao criar pergunta: ' + error.message);
    }
};

Question.getQuestionById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM "Questions" WHERE id = $1;', [id]);
        const question = result.rows[0];
        if (!question) throw new Error('Pergunta não encontrada');
        return {
            ...question,
            options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options
        };
    } catch (error) {
        throw new Error('Erro ao buscar pergunta: ' + error.message);
    }
};

Question.updateQuestion = async (id, questionData) => {
    const { question, correctAnswer, options, difficulty } = questionData;
    try {
        const result = await pool.query(
            'UPDATE "Questions" SET question = $1, "correctAnswer" = $2, options = $3, difficulty = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *;',
            [question, correctAnswer, JSON.stringify(options), difficulty, id]
        );
        const updatedQuestion = result.rows[0];
        if (!updatedQuestion) throw new Error('Pergunta não encontrada');
        return {
            ...updatedQuestion,
            options: typeof updatedQuestion.options === 'string' ? JSON.parse(updatedQuestion.options) : updatedQuestion.options
        };
    } catch (error) {
        throw new Error('Erro ao atualizar pergunta: ' + error.message);
    }
};

Question.deleteQuestion = async (id) => {
    try {
        const result = await pool.query('DELETE FROM "Questions" WHERE id = $1 RETURNING *;', [id]);
        const deletedQuestion = result.rows[0];
        if (!deletedQuestion) throw new Error('Pergunta não encontrada');
        return deletedQuestion;
    } catch (error) {
        throw new Error('Erro ao deletar pergunta: ' + error.message);
    }
};

Question.getAllQuestions = async () => {
    try {
        const result = await pool.query('SELECT * FROM "Questions" ORDER BY id ASC;');
        return result.rows.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
    } catch (error) {
        throw new Error('Erro ao buscar perguntas: ' + error.message);
    }
};

Question.count = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM "Questions";');
        return parseInt(result.rows[0].count);
    } catch (error) {
        throw new Error('Erro ao contar perguntas: ' + error.message);
    }
};

module.exports = Question; 
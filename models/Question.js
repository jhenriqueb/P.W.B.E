const pool = require('../db/database');

class Question {
    constructor(questionData) {
        if (!questionData) {
            throw new Error('Dados da pergunta são obrigatórios');
        }

        const { question, correctAnswer, options, difficulty } = questionData;

        if (!question || typeof question !== 'string') {
            throw new Error('Pergunta inválida');
        }

        if (!correctAnswer || typeof correctAnswer !== 'string') {
            throw new Error('Resposta correta inválida');
        }

        if (!Array.isArray(options) || options.length !== 3) {
            throw new Error('Opções inválidas - devem ser exatamente 3 opções');
        }

        if (!options.every(opt => typeof opt === 'string')) {
            throw new Error('Todas as opções devem ser strings');
        }

        if (!options.includes(correctAnswer)) {
            throw new Error('A resposta correta deve estar entre as opções');
        }

        if (!difficulty || typeof difficulty !== 'number' || difficulty < 1 || difficulty > 3) {
            throw new Error('Dificuldade inválida - deve ser um número entre 1 e 3');
        }

        this.question = question;
        this.correctAnswer = correctAnswer;
        this.options = options;
        this.difficulty = difficulty;
    }

    toJSON() {
        return {
            question: this.question,
            correctAnswer: this.correctAnswer,
            options: this.options,
            difficulty: this.difficulty
        };
    }

    validate() {
        return true;
    }

    
    static Database = class {
        static async create(questionData) {
            try {
                const question = new Question(questionData);
                question.validate();

                const result = await pool.query(
                    'INSERT INTO "Questions" (question, "correctAnswer", options, difficulty) VALUES ($1, $2, $3, $4) RETURNING *;',
                    [question.question, question.correctAnswer, JSON.stringify(question.options), question.difficulty]
                );
                return result.rows[0];
            } catch (error) {
                throw new Error('Erro ao criar pergunta: ' + error.message);
            }
        }

        static async findById(id) {
            try {
                const result = await pool.query('SELECT * FROM "Questions" WHERE id = $1;', [id]);
                const questionData = result.rows[0];
                if (!questionData) throw new Error('Pergunta não encontrada');
                
                return {
                    ...questionData,
                    options: typeof questionData.options === 'string' ? JSON.parse(questionData.options) : questionData.options
                };
            } catch (error) {
                throw new Error('Erro ao buscar pergunta: ' + error.message);
            }
        }

        static async update(id, questionData) {
            try {
                const question = new Question(questionData);
                question.validate();

                const result = await pool.query(
                    'UPDATE "Questions" SET question = $1, "correctAnswer" = $2, options = $3, difficulty = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *;',
                    [question.question, question.correctAnswer, JSON.stringify(question.options), question.difficulty, id]
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
        }

        static async delete(id) {
            try {
                const result = await pool.query('DELETE FROM "Questions" WHERE id = $1 RETURNING *;', [id]);
                const deletedQuestion = result.rows[0];
                if (!deletedQuestion) throw new Error('Pergunta não encontrada');
                return deletedQuestion;
            } catch (error) {
                throw new Error('Erro ao deletar pergunta: ' + error.message);
            }
        }

        static async findAll() {
            try {
                const result = await pool.query('SELECT * FROM "Questions" ORDER BY id ASC;');
                return result.rows.map(q => ({
                    ...q,
                    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
                }));
            } catch (error) {
                throw new Error('Erro ao buscar perguntas: ' + error.message);
            }
        }

        static async count() {
            try {
                const result = await pool.query('SELECT COUNT(*) FROM "Questions";');
                return parseInt(result.rows[0].count);
            } catch (error) {
                throw new Error('Erro ao contar perguntas: ' + error.message);
            }
        }
    }

    
    static async create(questionData) {
        return Question.Database.create(questionData);
    }

    static async findById(id) {
        return Question.Database.findById(id);
    }

    static async update(id, questionData) {
        return Question.Database.update(id, questionData);
    }

    static async delete(id) {
        return Question.Database.delete(id);
    }

    static async findAll() {
        return Question.Database.findAll();
    }

    static async count() {
        return Question.Database.count();
    }
}

module.exports = Question; 
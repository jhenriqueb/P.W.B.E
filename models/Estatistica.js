const pool = require('../db/database');

class Estatistica {
    constructor(data) {
        if (!data) {
            throw new Error('Dados das estatísticas são obrigatórios');
        }

        const { totalRespondidas, acertos, erros } = data;

        if (typeof totalRespondidas !== 'number' || totalRespondidas < 0) {
            throw new Error('Total de respondidas inválido');
        }

        if (typeof acertos !== 'number' || acertos < 0) {
            throw new Error('Número de acertos inválido');
        }

        if (typeof erros !== 'number' || erros < 0) {
            throw new Error('Número de erros inválido');
        }

        if (acertos + erros !== totalRespondidas) {
            throw new Error('Total de respondidas deve ser igual à soma de acertos e erros');
        }

        this.totalRespondidas = totalRespondidas;
        this.acertos = acertos;
        this.erros = erros;
    }

    toJSON() {
        return {
            totalRespondidas: this.totalRespondidas,
            acertos: this.acertos,
            erros: this.erros
        };
    }

    validate() {
        
        return true;
    }

    
    static Database = class {
        static async findOne() {
            try {
                const result = await pool.query('SELECT * FROM "Estatisticas" LIMIT 1;');
                let stats = result.rows[0];

                if (!stats) {
                    const createResult = await pool.query(
                        'INSERT INTO "Estatisticas" ("totalRespondidas", acertos, erros) VALUES (0, 0, 0) RETURNING *;'
                    );
                    stats = createResult.rows[0];
                }

                return new Estatistica(stats);
            } catch (error) {
                throw new Error('Erro ao buscar estatísticas: ' + error.message);
            }
        }

        static async update(acertou) {
            try {
                const stats = await this.findOne();
                
                stats.totalRespondidas += 1;
                if (acertou) {
                    stats.acertos += 1;
                } else {
                    stats.erros += 1;
                }

                stats.validate();

                const updateResult = await pool.query(
                    'UPDATE "Estatisticas" SET "totalRespondidas" = $1, acertos = $2, erros = $3, "updatedAt" = CURRENT_TIMESTAMP RETURNING *;',
                    [stats.totalRespondidas, stats.acertos, stats.erros]
                );
                return new Estatistica(updateResult.rows[0]);
            } catch (error) {
                throw new Error('Erro ao atualizar estatísticas: ' + error.message);
            }
        }

        static async reset() {
            try {
                const result = await pool.query('SELECT * FROM "Estatisticas" LIMIT 1;');
                let stats = result.rows[0];

                if (!stats) {
                    const createResult = await pool.query(
                        'INSERT INTO "Estatisticas" ("totalRespondidas", acertos, erros) VALUES (0, 0, 0) RETURNING *;'
                    );
                    return new Estatistica(createResult.rows[0]);
                }

                const updateResult = await pool.query(
                    'UPDATE "Estatisticas" SET "totalRespondidas" = 0, acertos = 0, erros = 0, "updatedAt" = CURRENT_TIMESTAMP RETURNING *;'
                );
                return new Estatistica(updateResult.rows[0]);
            } catch (error) {
                throw new Error('Erro ao reiniciar estatísticas: ' + error.message);
            }
        }

        static async count() {
            try {
                const result = await pool.query('SELECT COUNT(*) FROM "Estatisticas";');
                return parseInt(result.rows[0].count);
            } catch (error) {
                throw new Error('Erro ao contar estatísticas: ' + error.message);
            }
        }
    }

    static async findOne() {
        return Estatistica.Database.findOne();
    }

    static async update(acertou) {
        return Estatistica.Database.update(acertou);
    }

    static async reset() {
        return Estatistica.Database.reset();
    }

    static async count() {
        return Estatistica.Database.count();
    }
}

module.exports = Estatistica; 
const pool = require('../db/database');

const Estatistica = {};

// Métodos CRUD
Estatistica.getEstatisticas = async () => {
    try {
        const result = await pool.query('SELECT * FROM "Estatisticas" LIMIT 1;');
        let stats = result.rows[0];

        if (!stats) {
            // Se não existir, cria um novo registro
            const createResult = await pool.query('INSERT INTO "Estatisticas" ("totalRespondidas", acertos, erros) VALUES (0, 0, 0) RETURNING *;');
            stats = createResult.rows[0];
        }
        return stats;
    } catch (error) {
        throw new Error('Erro ao buscar estatísticas: ' + error.message);
    }
};

Estatistica.atualizarEstatisticas = async (acertou) => {
    try {
        const result = await pool.query('SELECT * FROM "Estatisticas" LIMIT 1;');
        let stats = result.rows[0];

        if (!stats) {
            const createResult = await pool.query(
                'INSERT INTO "Estatisticas" ("totalRespondidas", acertos, erros) VALUES ($1, $2, $3) RETURNING *;',
                [1, acertou ? 1 : 0, acertou ? 0 : 1]
            );
            return createResult.rows[0];
        }

        stats.totalRespondidas += 1;
        if (acertou) {
            stats.acertos += 1;
        } else {
            stats.erros += 1;
        }

        const updateResult = await pool.query(
            'UPDATE "Estatisticas" SET "totalRespondidas" = $1, acertos = $2, erros = $3, "updatedAt" = CURRENT_TIMESTAMP RETURNING *;',
            [stats.totalRespondidas, stats.acertos, stats.erros]
        );
        return updateResult.rows[0];
    } catch (error) {
        throw new Error('Erro ao atualizar estatísticas: ' + error.message);
    }
};

Estatistica.reiniciarEstatisticas = async () => {
    try {
        const result = await pool.query('SELECT * FROM "Estatisticas" LIMIT 1;');
        let stats = result.rows[0];

        if (!stats) {
            const createResult = await pool.query('INSERT INTO "Estatisticas" ("totalRespondidas", acertos, erros) VALUES (0, 0, 0) RETURNING *;');
            return createResult.rows[0];
        }

        const updateResult = await pool.query(
            'UPDATE "Estatisticas" SET "totalRespondidas" = 0, acertos = 0, erros = 0, "updatedAt" = CURRENT_TIMESTAMP RETURNING *;'
        );
        return updateResult.rows[0];
    } catch (error) {
        throw new Error('Erro ao reiniciar estatísticas: ' + error.message);
    }
};

Estatistica.count = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM "Estatisticas";');
        return parseInt(result.rows[0].count);
    } catch (error) {
        throw new Error('Erro ao contar estatísticas: ' + error.message);
    }
};

module.exports = Estatistica; 
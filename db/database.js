const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'quiz',
    password: process.env.DB_PASSWORD || '3110',
    port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
    console.log('Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Erro na conexão do banco de dados:', err);
});

module.exports = pool; 
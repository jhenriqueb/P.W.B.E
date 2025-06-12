const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/routers')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const pool = require('./db/database')

app.set('views', 'views')
app.set('view engine', 'ejs')
app.set('layout', 'layout')
app.use(expressLayouts)

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(session({
    secret: process.env.SESSION_SECRET || 'chave-secreta-do-jogo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use('/', router)

// Verifica conexão com o banco antes de iniciar o servidor
pool.query('SELECT 1')
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`)
        })
    })
    .catch(error => {
        console.error('Erro ao conectar com o banco de dados:', error)
        process.exit(1)
    })

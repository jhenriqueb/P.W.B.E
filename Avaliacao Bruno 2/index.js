const express = require('express')
const app = express()
const port = 3000
const router = require('./routes/routers')
const expressLayouts = require('express-ejs-layouts')

// Configuração do EJS e Layouts
app.set('views', 'views')
app.set('view engine', 'ejs')
app.set('layout', 'layout')
app.use(expressLayouts)

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

// Rotas
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

const express = require('express');
const app = express();
const port = 3000;

const expressLayouts = require('express-ejs-layouts');
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const jogoRoutes = require('./routes/jogo');

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(expressLayouts);

app.use('/', homeRoutes); 
app.use('/admin', adminRoutes);
app.use('/jogo', jogoRoutes);

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});

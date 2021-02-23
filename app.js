const express = require('express');
const mainRouter = require('./routes/index');
const hbs = require('express-handlebars')
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/' }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter)

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})

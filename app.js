const express = require('express');
const mainRouter = require('./routes/index');
const hbs = require('express-handlebars')
const path = require('path');
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session');
const passport = require('passport');

const app = express();
require('./auth/auth');

const PORT = process.env.PORT || 3000;
// app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: 'KEY',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))
app.use(passport.initialize())
app.use(passport.session())
const URI = 'mongodb+srv://flenkyboy:flenkyboy@cluster0.obmwc.mongodb.net/analytica?retryWrites=true&w=majority'
mongoose.connect(URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
    useFindAndModify: false
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname +
        '/views/layout/', partialsDir: __dirname + '/views/partial/'
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', mainRouter)
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})

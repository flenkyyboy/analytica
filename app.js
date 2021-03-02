const express = require('express');
const mainRouter = require('./routes/index');
const hbs = require('express-handlebars')
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport');



const app = express();
const PORT = process.env.PORT || 3000;

require('./auth/auth');

// app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:'KEY',
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
const URI = 'mongodb+srv://flenkyboy:flenkyboy@cluster0.obmwc.mongodb.net/analytica?retryWrites=true&w=majority'
mongoose.connect(URI,{ useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex:true, useFindAndModify: false  }, (err)=>{
    if(!err){
        console.log('success');
    }
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/' }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter)

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
})

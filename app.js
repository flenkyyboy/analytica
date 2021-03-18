const express = require("express");
const mainRouter = require("./routes/index");
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore=require('connect-mongo')

const app = express();
require("./auth/auth");

const PORT = process.env.PORT || 3000;
const URI =
  "mongodb+srv://flenkyboy:flenkyboy@cluster0.obmwc.mongodb.net/analytica?retryWrites=true&w=majority";
  const URISESS =
  "mongodb+srv://flenkyboy:flenkyboy@cluster0.obmwc.mongodb.net/analyticasess?retryWrites=true&w=majority";

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "KEY",
    store: MongoStore.create({ mongoUrl: URISESS }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partial/",
    helpers: {
      pagination: (totalSession) => {
        let result = "";
        for (let i = 1; i < totalSession / 5; i++) {
          result =
            result +
            `<li class="page-item"><a class="page-link" href="/session?page=${i}">${i}</a></li>`;
        }
        return result;
      },
      paginationAdmin: (totalSession) => {
        let result = "";
        for (let i = 1; i < totalSession / 5; i++) {
          result =
            result +
            `<li class="page-item"><a class="page-link" href="/allSession?page=${i}">${i}</a></li>`;
        }
        return result;
      },
      stringNotEqual:(arg1,arg2,options)=>{
        return (arg1!=arg2) ? options.fn(this) : options.inverse(this);
      }
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

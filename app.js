const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

// const partials_path=path.join(__dirname,"../views/partials")
//load config
connectDB();

//pssport config
require("./config/passport")(passport);

const app = express();
// exphbs.registerPartials(partials_path)

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method-override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebars helpers

const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");

//handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", ".hbs");
// app.set('views', './views');

//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
    }),
    // store:new MongoStore({mongooseConnection:mongoose.connection})
  })
);

//passport middleware

app.use(passport.initialize());
app.use(passport.session());

//Set gloagal variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on ports ${PORT}`)
);

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
// const commentRoutes = require("./comments");
// const theaterRoutes = require("./theaters");

const app = express();
const { URI, PORT } = require("./config/index");

// view engine setup
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    partialsDir: "views/partials/",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

handlebars.Handlebars = handlebars;

// Add the following line to disable the prototype access check
handlebars.Handlebars.Utils.escapeExpression = function (value) {
  return value;
};

// Set the view engine to use Handlebars

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);

main().catch((err) => console.log(err));
async function main() {
  try {
    await mongoose.connect(URI);

    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

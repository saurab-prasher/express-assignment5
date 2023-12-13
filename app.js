const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const dbHelpers = require("./helpers/index");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const passport = require("passport");
// const helmet = require("helmet");
const LocalStrategy = require("passport-local");
const flash = require("express-flash");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
const { URI, SECRET_ACCESS_TOKEN } = require("./config/index");
const { isLoggedIn, isAdmin } = require("./middlewares/auth");
const formFields = require("./helpers/generateForm");
const generateFormFields = require("./helpers/generateUserForm");
const Movie = require("./models/movies");
const User = require("./models/users");

// View engine setup
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(handlebars),
    partialsDir: "views/partials/",
    defaultLayout: "main",
    helpers: {
      formatReleaseDate,
      isErrorForField: function (field, errors, options) {
        if (errors && errors.length > 0) {
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            if (error.path === field) {
              return options.fn({ msg: error.msg }); // Render the error message
            }
          }
        }

        return options.inverse(this); // No error found for the field
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(URI);
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application on database connection error
  }
}

// Middleware
const store = new MongoStore({
  mongoUrl: URI,
  secret: SECRET_ACCESS_TOKEN,
  touchAfter: 24 * 60 * 60,

  clear_interval: 3600,
});

const sessionConfig = {
  store,
  name: "session",
  secret: SECRET_ACCESS_TOKEN,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// app.use(helmet());

// app.use(
//   helmet.contentSecurityPolicy({
//       directives: {
//           defaultSrc: [],
//           connectSrc: ["'self'"],
//           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//           workerSrc: ["'self'", "blob:"],
//           childSrc: ["blob:"],
//           objectSrc: [],
//           imgSrc: [
//               "'self'",
//               "blob:",
//               "data:",
//               "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//               "https://images.unsplash.com",
//           ],
//           fontSrc: ["'self'",],
//       },
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", express.static(path.join(__dirname, "public")));
app.use("/api/movies", express.static(path.join(__dirname, "public")));
app.use("/movies", express.static(path.join(__dirname, "public")));
app.use("/movies/updatemovie/", express.static(path.join(__dirname, "public")));

// app.use("/updatemovie", express.static(path.join(__dirname, "public")));

// let store = MongoStore.create({
//   url: URI, // MongoDB connection URL
//   collection: "sessions", // Collection name for sessions
//   autoRemove: "interval",
//   autoRemoveInterval: 10, // Time in minutes to check and remove expired sessions
//   touchAfter: 24 * 3600, // Time interval in seconds for session updates in the database
// });

handlebars.Handlebars = handlebars;
handlebars.Handlebars.Utils.escapeExpression = function (value) {
  return value;
};

function formatReleaseDate(releaseDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(releaseDate).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}

// Connect to the database and start the server
connectToDatabase().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
  });
});

// Authentication Routes

// Login route
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login");
});

// Handle login form submission
app.post(
  "/login",

  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),

  (req, res) => {
    // If authentication succeeds, you can redirect to a success page here

    if (req.user && req.user.id) {
      req.session.userId = req.user.id;
    }
    // req.flash("success", "Successfully Logged In!");
    res.redirect("/");
  }
);

// Logout route
app.post("/logout", async (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, you can get their ID from the req.user object
    const userId = req.user._id; // Assuming the user ID is stored in the _id field

    // Use the await keyword with findById() to retrieve the user
    const user = await User.findById(userId);

    if (user) {
      // Use the `remove` method to delete the user's sessions
      await store.destroy(user._id);
    }
  }

  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
});

// Registration route
app.get("/register", (req, res) => {
  res.render("register");
});

const registrationValidationRules = generateFormFields(User.schema).map(
  (field) => {
    return body(field.name)
      .notEmpty()
      .withMessage(
        `${
          field.name.charAt(0).toUpperCase() + field.name.slice(1)
        } is required`
      );
  }
);

app.post("/register", registrationValidationRules, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("register", {
        errors: errors.array(),
        formData: formFields,
      });
    }
    // if (!errors.isEmpty()) {
    //   // Validation errors exist
    //   const errorMessages = errors.array().map((error) => error.msg);
    //   req.flash("error", errorMessages); // Set flash messages for errors
    //   return res.redirect("/register");
    // }
    const { username, password, email } = req.body;

    // Check if any admin user exists
    const adminUserExists = await User.exists({ role: "admin" });

    // Determine the role for the new user
    const role = adminUserExists ? "user" : "admin";

    const user = new User({ email, username, role });

    // Perform input validation here (e.g., check for required fields, validate email format, etc.)

    // Create a new user account
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "User registered successfully.");
      res.redirect("/");
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    // Use req.flash to set an error message
    req.flash("error", "Internal Server Error");
    res.redirect("/register");
  }
});

// Routes
app.get("/", async (req, res) => {
  const result = await dbHelpers.getTopRatedMovies();
  res.render("index", { movies: result });
});

// Render the update movie form
app.get("/movies/updatemovie/:id", isAdmin, async (req, res) => {
  const movieId = req.params.id;
  // Fetch the movie data from your database using the movieId
  const movie = await Movie.findById(movieId);

  // Render the update form and pass the movie data to the template
  res.render("updateForm", { movie });
});

// Get a list of all movies with pagination
// GET /api/Movies
// o This route must accept the numeric query parameters "page" and "perPage" as well as
// the (optional) string parameter "title", ie: /api/movies?page=1&perPage=5&title=The
// Avengers. It will use these values to return all "Movie" objects for a specific "page" to
// the client as well as optionally filtering by "title", if provided (in this case, it will show
// both “The Avengers” films).
app.get("/api/movies", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default perPage value

    if (req.query.title) {
      // If title parameter is present, perform a search by title

      const {
        allMovies,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        totalMovies,
      } = await dbHelpers.getAllMoviesOrSearch(req.query.title, page, perPage);

      res.render("movies", {
        movies: allMovies,
        totalMovies,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        perPage,
      });
    } else {
      const {
        allMovies,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        totalMovies,
      } = await dbHelpers.getAllMoviesOrSearch(
        (title = undefined),
        page,
        perPage
      );

      res.render("movies", {
        movies: allMovies,
        totalMovies,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        perPage,
      });
    }
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/Movies This route uses the body of the request to add a new "Movie" document to the
// collection and return the created object / fail message to the client.

const validationRules = formFields.map((field) => {
  return body(field.name)
    .notEmpty()
    .withMessage(
      `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`
    );
});

// Render add movie form
app.get("/movies/addmovie", (req, res) => {
  res.render("addMovie", { formData: formFields });
});

app.post(
  "/api/movies",
  [...validationRules],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("addMovie", {
          errors: errors.array(),
          formData: formFields,
        });
      }

      const castInput = req.body.cast;
      const castArray = castInput.split(",").map((actor) => actor.trim());
      const genresInput = req.body.cast;
      const genresArray = genresInput.split(",").map((actor) => actor.trim());
      const newMovieData = {
        title: req.body.title,
        plot: req.body.plot,
        genres: genresArray,
        runtime: req.body.runtime,
        rated: req.body.rated,
        poster: req.body.poster,
        lastupdated: req.body.lastupdated,
        poster: req.body.poster,
        cast: castArray,
      };
      const newMovie = new Movie(newMovieData);

      const result = dbHelpers.addMovie(newMovie);

      res.render("movieSuccess", {
        ...result,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to add a new movie." });
      // }
    }
  }
);

// Get details of a specific movie by ID
// • GET /api/Movies
// o This route must accept a route parameter that represents the _id of the desired movie
// object, ie: /api/movies/573a1391f29313caabcd956e. It will use this parameter to return
// a specific "Movie" object to the client.
app.get("/api/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.render("movie", { movieData: movie });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// • PUT /api/Movies
// o This route must accept a route parameter that represents the _id of the desired movie
// object, ie: /api/movies/573a1391f29313caabcd956e. It will use this parameter to return
// a specific "Movie" object to the client.

// /movies/api/update/573a13cdf29313caabd84f84
app.post("/api/movies/:id", isAdmin, async (req, res, next) => {
  try {
    if (req.body.action === "updateMovie") {
      const result = await dbHelpers.updateMovieById(req.body, req.params.id);

      res.render("movieSuccess", {
        ...result,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// • DELETE /api/Movies
// o This route must accept a route parameter that represents the _id of the desired movie
// object, ie: /api/movies/573a1391f29313caabcd956e as well as read the contents of the
// request body. It will use these values to update a specific "Movie" document in the
// collection and return a success / fail message to the client.
app.post("/api/movies/:id", isAdmin, async (req, res) => {
  try {
    const result = await dbHelpers.deleteMovieById({ _id: req.body.id });

    res.render("movieSuccess", {
      ...result,
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("*", (req, res) => {
  res.status(404).render("notFound");
});

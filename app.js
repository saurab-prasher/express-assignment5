const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const mongoose = require("mongoose");
const Movie = require("./models/movies");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
const { URI } = require("./config/index");

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
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/movies", express.static(path.join(__dirname, "public")));
app.use("/updateMovie", express.static(path.join(__dirname, "public")));
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
    console.log(`Server listening on port ${port}`);
  });
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to Mflix" });
});

app.get("/addmovie", (req, res) => {
  res.render("addMovie");
});

// Get a list of all movies with pagination
app.get("/movies", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10; // Adjust this based on your preference

  console.log("abc");
  try {
    const movies = await Movie.find({})
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / perPage);
    console.log(movies[0]);

    res.render("movies", {
      movies: movies,

      totalPages: totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/movies", async (req, res) => {
  try {
    const newMovieData = req.body;
    const newMovie = new Movie(newMovieData);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
    console.log(savedMovie);
  } catch (error) {
    console.error("Failed to add a new movie:", error);
    res.status(500).json({ error: "Failed to add a new movie." });
  }
});

app.get("/movies/search", (req, res) => {
  res.render("searchForm");
});
app.get("/movies/api", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default perPage value
    const title = req.query.title;

    let query = {};

    if (title) {
      // If 'title' parameter is provided, add it to the query
      console.log(req.query.title);
      query = { title: { $regex: req.query.title, $options: "i" } }; // Case-insensitive search
    }

    const movies = await Movie.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    console.log(movies);
    res.render("movies", {
      movies: movies,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get details of a specific movie by ID
app.get("/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    console.log(movie.title);
    res.render("movie", { movieData: movie });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/updateMovie/:id", async (req, res) => {
  console.log(req.params.id);
  res.render("updateForm");
});

app.put("/movies/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific movie by ID
app.delete("/movies/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(deletedMovie);
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

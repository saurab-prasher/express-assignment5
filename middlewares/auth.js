module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash.error = "You must be signed in first!";
    // req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

// Custom middleware to check if the user is an admin
module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    // User is an admin, allow access to all movie-related routes
    return next();
  } else {
    // User is not an admin, deny access
    res.render("accessDenied");
    // res.status(403).send("Access denied. You are not authorized.");
  }
};

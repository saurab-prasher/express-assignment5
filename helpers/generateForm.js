const Movie = require("../models/movies");

// Get the movie schema
const movieSchema = Movie.schema;

// Define an array to store form fields
const formFields = [];

// Iterate through the schema's paths to generate form fields
for (const path in movieSchema.paths) {
  // Exclude fields that you want to skip (e.g., _id, __v, etc.)
  if (path === "_id" || path === "__v") {
    continue;
  }

  const pathType = movieSchema.paths[path].instance;

  // Define a default value based on the type (you can customize this)
  let defaultValue;
  if (pathType === "Number") {
    defaultValue = 0;
  } else if (pathType === "Date") {
    defaultValue = new Date().toISOString().substring(0, 10);
  } else {
    defaultValue = "";
  }

  // Create a form field object
  const formField = {
    name: path,
    label: path.charAt(0).toUpperCase() + path.slice(1) + ":",
    type: pathType.toLowerCase(),
    value: defaultValue,
  };
  console.log(formField.label);

  // Add the form field to the array
  formFields.push(formField);
}

// Now, the formFields array contains form fields for every field in the movie model
module.exports = formFields;

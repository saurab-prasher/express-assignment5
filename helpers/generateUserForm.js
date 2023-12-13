// Get the movie schema

module.exports = (schema, excludedPaths = ["hash", "salt"]) => {
  const formFields = [];

  // Specify the paths (fields) you want to include in the form
  const includedFieldNames = ["username", "email", "password"];

  // Iterate through the schema's paths (fields)
  schema.eachPath((path) => {
    // Check if the path should be included in the form
    if (includedFieldNames.includes(path)) {
      // Determine the input type based on the field's type
      let inputType = "text"; // Default to text input
      if (schema.paths[path].instance === "String") {
        if (path === "email") {
          inputType = "email"; // Use email input type for email field
        } else if (path === "password") {
          inputType = "password"; // Use password input type for password field
        }
      }

      // Generate the form field object
      const formField = {
        label: path.charAt(0).toUpperCase() + path.slice(1), // Capitalize the first letter of the field name
        name: path,
        type: inputType,
      };

      // Add the form field to the array
      formFields.push(formField);
    }
  });

  return formFields;
};

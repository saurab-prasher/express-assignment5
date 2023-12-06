console.log("chal pada");
document
  .getElementById("movieForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    try {
      const response = await fetch("/movies", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        displayError(errorData.errors);
      } else {
        // Handle successful form submission
        // For example, display a success message or redirect
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

function displayError(errors) {
  const titleError = document.getElementById("titleError");
  const titleInput = document.getElementById("title");

  // Reset previous error messages
  titleError.textContent = "";

  // Display error message next to the title field
  errors.forEach((error) => {
    if (error.param === "title") {
      titleError.textContent = error.msg;
      titleInput.classList.add("error"); // Optionally add a CSS class for styling
    }
    // Handle other fields' errors similarly if needed
  });
}

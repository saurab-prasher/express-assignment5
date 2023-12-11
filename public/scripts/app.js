console.log("daf");
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("navbar-user");
  const dropdown = document.getElementById("user-dropdown");

  menuButton.addEventListener("click", function (event) {
    // Toggle the visibility of the dropdown
    dropdown.classList.toggle("hidden");

    // Prevent the click event from propagating to the document click event
    event.stopPropagation();
  });

  // Close the dropdown when clicking outside of it
  document.addEventListener("click", function () {
    dropdown.classList.add("hidden");
  });
});

console.log("daf");

// Attach event listeners to buttons triggering the modal
const openModalButton = document.querySelector("#open-modal-button");
const closeModalButton = document.querySelector("#close-modal-button");
const cancelBtn = document.querySelector("#cancel-button");
const modal = document.querySelector("#main-modal");
const deleteMovieBtn = document.querySelector("#delete-movie-button");
const LoginSuccessMsg = document.querySelector("#login-success");

deleteMovieBtn?.addEventListener("click", () => {
  modal.classList.remove("hidden");
  console.log("delete");
});
cancelBtn?.addEventListener("click", () => {
  modal.classList.add("hidden");
});

setTimeout(() => {
  const successMessage = document.getElementById("success-message");

  successMessage?.classList.remove("hidden");
  setTimeout(() => {
    successMessage?.classList.add("hidden");
  }, 3000); // Hide the message after 3 seconds
}, 1000); // Show the message after 1 second (adjust the timing as needed)

// Function to hide the error message after 5 seconds
function hideErrorMessage() {
  const errorMessage = document.getElementById("error-message");
  if (errorMessage) {
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000); // 5000 milliseconds (5 seconds)
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  hideErrorMessage();
});

// Function to open the "Edit Movie" modal
// function openEditMovieModal() {
//   const modal = document.getElementById("editMovieModal");
//   modal.style.display = "block";
//   setTimeout(() => {
//     modal.classList.add("opacity-100");
//     modal.querySelector(".bg-gray-500").classList.add("opacity-100");
//   }, 10);
// }

// Get references to the modal and backdrop elements

// const backdrop = modal.querySelector(".bg-gray-500");

// Function to open the modal
function openModal() {
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add("opacity-100");
    backdrop.classList.add("opacity-100");
  }, 10); // Adding a small delay for transitions to work smoothly
}

// Function to close the modal
function closeModal() {
  modal.classList.remove("opacity-100");
  backdrop.classList.remove("opacity-100");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300); // Transition duration (adjust as needed)
}

// openModalButton.addEventListener("click", openModal);
// closeModalButton.addEventListener("click", closeModal);

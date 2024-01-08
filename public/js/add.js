// Retrieve data from local storage
const bookCover = localStorage.getItem("bookCover");
const bookTitle = localStorage.getItem("bookTitle");
const author = localStorage.getItem("author");
const year = localStorage.getItem("year");

// Show add section of the page if any of the local storage items are present
if (bookCover || bookTitle || author || year) {
  document.getElementById(`newBook`).classList.remove("hide");

  //   scroll down to add new section when coming back from pagination page
  document.addEventListener("DOMContentLoaded", function () {
    const targetSection = document.getElementById("addNewSection");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Populate form fields with local storage data
document.getElementById("bookName").value = bookTitle;
document.getElementById("publicationYear").value = year;
document.getElementById("authorName").value = author;
document.getElementById("book_id").value = bookCover;

// Clear local storage after page refresh
localStorage.clear();

const newBook_form = document.getElementById("newBook__form");

// Prevent the default form submit function as two buttons inside a form clashing the submit and hide functionality
newBook_form.addEventListener("submit", function (event) {
  event.preventDefault();
});

// Save button on add.html
function submitForm() {
  // Get form data
  const formData = new FormData(newBook_form);

  // Extract individual form fields
  const bookName = formData.get("name");
  const year = formData.get("year");
  const author = formData.get("author");
  const bookId = formData.get("id");
  const buyLink = formData.get("buy");
  const pdfLink = formData.get("pdf");
  const summary = formData.get("summary");
  const quote = formData.get("quote");
  const review = formData.get("review");
  const rating = formData.get("rating");

  // users usually might not know what's the cover_edition_key is, so book_id is omitted from must
  if (bookName && year && author && summary && quote && review && rating) {
    // Validate rating range
    if (rating <= 10) {
      // Submit the form if all conditions are met
      document.getElementById("newBook__form").submit();
    } else {
      // Display an alert if rating is out of range
      alert("Rating must be less than or equal to 10");
    }
  }
}

// Script for hiding the form on add.html
function newBookReverse() {
  document.getElementById(`newBook`).classList.add("hide");
}

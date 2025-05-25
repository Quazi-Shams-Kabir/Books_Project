const API_URL = "https://openlibrary.org/search.json?q=";

let searchInput = "";

// form will not be submitted to the backend and the page will not get refreshed upon clicking submit
const searchForm = document.getElementById("myForm");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchInput = document.getElementById("searchInput").value;
  const modifiedSearchInput = searchInput.replace(/ /g, "+");

  const itemsPerPage = 4;
  let currentPage = 1;

  async function fetchData() {
    try {
      const response = await fetch(API_URL + modifiedSearchInput);
      const data = await response.json();
      return data.docs;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  async function displayDataAndPagination() {
    const data = await fetchData();
    displayData(data, currentPage);
    setupPagination(data);
  }

  function displayData(items, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    // div_2
    const dataContainer = document.getElementById("data-container");
    dataContainer.innerHTML = "";

    paginatedItems.forEach((item) => {
      // in openlibrary search api, they dont have covers for every isbn[0] and not everyone have cover_edition_key
      let imgSrc;
      if (item.cover_edition_key) {
        imgSrc =
          "https://covers.openlibrary.org/b/olid/" +
          item.cover_edition_key +
          "-M.jpg";
      } else {
        imgSrc = "assets/images/emptyBookCover.png";
      }

      // div_2.i
      const innerContainer = document.createElement("div");
      innerContainer.classList.add("innerContainer");
      innerContainer.id = item.key; // just for unique_id purpose (keys are unique)
      dataContainer.appendChild(innerContainer);

      // add an onClick event to the innnerContainer of data-container div  to send data to backend to store
      innerContainer.addEventListener("click", function () {
        if (item.cover_edition_key) {
          localStorage.setItem("bookCover", item.cover_edition_key);
        }
        if (item.first_publish_year) {
          localStorage.setItem("year", item.first_publish_year);
        }
        if (
          item.author_name &&
          Array.isArray(item.author_name) &&
          item.author_name.length > 0
        ) {
          localStorage.setItem("author", item.author_name[0]);
        }
        if (item.title) {
          localStorage.setItem("bookTitle", item.title);
        }
        window.location.href = "/";
      });

      const innerContainerId = document.getElementById(item.key);
      // div_2.i.1
      const imgContainer = document.createElement("div");
      imgContainer.id = "imgOf" + item.key;
      innerContainerId.appendChild(imgContainer);
      const imgContainerId = document.getElementById("imgOf" + item.key);

      const imgElement = document.createElement("img");
      imgElement.classList.add("bookCover");
      imgElement.src = imgSrc;
      imgElement.alt = "book cover of " + item.title;
      imgContainerId.appendChild(imgElement);

      // div_2.i.2
      const detailsContainer = document.createElement("div");
      detailsContainer.classList.add("detailsContainer");
      detailsContainer.id = "detailsOf" + item.key;
      innerContainerId.appendChild(detailsContainer);
      const detailsContainerId = document.getElementById(
        "detailsOf" + item.key
      );

      const nameElement = document.createElement("div");
      nameElement.classList.add("title");
      nameElement.textContent = item.title;
      detailsContainerId.appendChild(nameElement);

      const authorElement = document.createElement("div");
      // Check if item.author_name exists and is an array before accessing the first element
      if (
        item.author_name &&
        Array.isArray(item.author_name) &&
        item.author_name.length > 0
      ) {
        authorElement.textContent = "- " + item.author_name[0];
      } else {
        // Handle the case where author_name is not defined or is an empty array
        authorElement.textContent = "- Unknown Author";
      }
      detailsContainerId.appendChild(authorElement);
    });
  }

  function setupPagination(items) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const visiblePages = 2; // Number of pages to show before and after the active page

    const prevButton = document.createElement("li");
    const prevLink = document.createElement("a");
    prevLink.href = "#";
    prevLink.textContent = "<<";
    prevButton.appendChild(prevLink);
    pagination.appendChild(prevButton);

    for (
      let i = currentPage - visiblePages;
      i <= currentPage + visiblePages;
      i++
    ) {
      if (i >= 1 && i <= totalPages) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = i;

        link.addEventListener("click", function (event) {
          event.preventDefault();
          currentPage = i;
          setupPagination(items);
          displayData(items, currentPage);
          highlightCurrentPage();
        });

        li.appendChild(link);
        pagination.appendChild(li);
      }
    }

    const nextButton = document.createElement("li");
    const nextLink = document.createElement("a");
    nextLink.href = "#";
    nextLink.textContent = ">>";
    nextButton.appendChild(nextLink);
    pagination.appendChild(nextButton);

    nextLink.addEventListener("click", function (event) {
      // Default Behavior:
      // When an user interacts with a webpage, certain actions trigger default behaviors. For example, when a user clicks on a link (<a> element), the default behavior is to navigate to the URL specified in the href attribute.
      // here in this case, it's preventing page reload whne clicking the link
      event.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        setupPagination(items);
        displayData(items, currentPage);
        highlightCurrentPage();
      }
    });

    prevLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        setupPagination(items);
        displayData(items, currentPage);
        highlightCurrentPage();
      }
    });

    highlightCurrentPage();
  }

  function highlightCurrentPage() {
    const links = document.querySelectorAll(".pagination li a");
    links.forEach((link) => {
      link.classList.remove("active");
      if (link.textContent === currentPage.toString()) {
        link.classList.add("active");
        Document;
      }
    });
  }

  // Initial display
  displayDataAndPagination();
});

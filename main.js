document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const bookFormIsComplete = document.getElementById("bookFormIsComplete");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const editBookForm = document.getElementById("editBookForm");
  const editBookTitle = document.getElementById("editBookTitle");
  const editBookAuthor = document.getElementById("editBookAuthor");
  const editBookYear = document.getElementById("editBookYear");
  const editBookIsComplete = document.getElementById("editBookIsComplete");
  const editBookModal = document.getElementById("editBookModal");
  const closeModalButton = document.querySelector(".close");
  const searchBookForm = document.getElementById("searchBook");
  const searchBookTitleInput = document.getElementById("searchBookTitle");

  let currentBook = null;
  editBookModal.style.display = "none";

  function saveBooksToLocalStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function loadBooksFromLocalStorage() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach(addBookToDOM);
  }

  function createBookItem(book) {
    const bookItem = document.createElement("div");
    bookItem.classList.add("card", "wt-100");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button class="button success mr-5" data-action="toggleCompletion" data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca"}
      </button>
      <button class="button danger mr-5" data-action="deleteBook" data-testid="bookItemDeleteButton">
        Hapus Buku
      </button>
      <button class="button warning mr-5" data-action="editBook" data-testid="bookItemEditButton">
        Edit Buku
      </button>
    </div>
  `;

    bookItem
      .querySelector('[data-action="toggleCompletion"]')
      .addEventListener("click", () => toggleBookCompletion(book, bookItem));
    bookItem
      .querySelector('[data-action="deleteBook"]')
      .addEventListener("click", () => deleteBook(book, bookItem));
    bookItem
      .querySelector('[data-action="editBook"]')
      .addEventListener("click", () => editBook(book));

    return bookItem;
  }

  function addBookToDOM(book) {
    const bookItem = createBookItem(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  }

  function toggleBookCompletion(book, bookItem) {
    book.isComplete = !book.isComplete;
    const button = bookItem.querySelector('[data-action="toggleCompletion"]');
    button.textContent = book.isComplete
      ? "Belum Selesai dibaca"
      : "Selesai dibaca";

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = books.map((existingBook) =>
      existingBook.id === book.id ? book : existingBook
    );
    saveBooksToLocalStorage(updatedBooks);

    renderBookList();
  }

  function deleteBook(book, bookItem) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = books.filter(
      (existingBook) => existingBook.id !== book.id
    );
    saveBooksToLocalStorage(updatedBooks);

    bookItem.remove();
  }

  function editBook(book) {
    currentBook = book;
    editBookTitle.value = book.title;
    editBookAuthor.value = book.author;
    editBookYear.value = book.year;
    editBookIsComplete.checked = book.isComplete;
    editBookModal.style.display = "flex";
  }

  function renderBookList() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach(addBookToDOM);
  }

  editBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    currentBook.title = editBookTitle.value;
    currentBook.author = editBookAuthor.value;
    currentBook.year = editBookYear.value;
    currentBook.isComplete = editBookIsComplete.checked;

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = books.map((existingBook) =>
      existingBook.id === currentBook.id ? currentBook : existingBook
    );
    saveBooksToLocalStorage(updatedBooks);

    renderBookList();
    editBookModal.style.display = "none";
  });

  closeModalButton.addEventListener("click", () => {
    editBookModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === editBookModal) {
      editBookModal.style.display = "none";
    }
  });

  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = bookFormIsComplete.checked;

    const newBook = {
      id: Date.now(),
      title,
      author,
      year: parseInt(year, 10),
      isComplete,
    };

    const bookItem = createBookItem(newBook);
    if (isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }

    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    existingBooks.push(newBook);

    saveBooksToLocalStorage(existingBooks);

    bookForm.reset();
    bookFormIsComplete.checked = false;
  });

  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook(searchBookTitleInput.value);
  });

  function searchBook(title) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    filteredBooks.forEach(addBookToDOM);
  }

  loadBooksFromLocalStorage();
});

// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI{
  static displayBooks()
  {
    // array of book objects, get it from LocalStorage 
    const storedBooks= store.getBook();
    storedBooks.forEach((book) => UI.addBookToList(book));
  }


  static addBookToList(book)
  {
    const list = document.querySelector('#js-book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }

  static removeBook(element){
     // Check if the clicked element has the class 'delete'
    // If yes, remove the entire book row (tr) from the table
    if(element.classList.contains('delete')){
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className)
  {
  const div =  document.createElement('div');
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector('.container');
  const form = document.querySelector('#js-book-form');
  container.insertBefore(div, form);

  // disappear after 3 seconds
  setTimeout(() => div.remove(),3000);
  
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';

  }
}
 // Store Class: Handle Local Storage
  
 class store{

  static getBook(){
    let books;
    if(localStorage.getItem('books') === null)
      books = [];
    else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    
    return books;

  }

  static addBook(book){
    const books = store.getBook();
    books.push(book);
    localStorage.setItem('books',JSON.stringify(books));
  }

  // USE ISBN as unique Identifier to get the Book
  static removeBook(isbn){

    const books = store.getBook();

    books.forEach((book, index) => {
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

 }

 // Event: Display Books


 // When the HTML page is fully loaded, call the displayBooks function to show the books.

 document.addEventListener('DOMContentLoaded', UI.displayBooks);

 // Event: Add a book
  document.querySelector('#js-book-form').addEventListener('submit',(e) =>
{
  e.preventDefault(); // Stop the form from refreshing the page

  //  When the user submits the form, Get form values 
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;


  // Validate
  if(title === '' || author === '' || isbn === ''){
    UI.showAlert('Please fill in all fields', 'danger');
  } 
  else{
    // Initiate a book
  const book = new Book(title, author, isbn);

    // Add BOOK to UI List
    UI.addBookToList(book);
    // Add a Book to LocalStorage
    store.addBook(book);

    // Show Success message
    UI.showAlert('book added','success');

    // Clear fields
    UI.clearFields();
  }

});

 //Event: Remove a book
 document.querySelector('#js-book-list').addEventListener('click',(e) => {
  // e.target return which book has been clicked, Remove from UI
  UI.removeBook(e.target);

  // Remove a Book from LocalStorage
  // 1. e.target: <a> is the delete button we clicked
  // 2. parent element is <td> that contain <a>
  // 3. previousElementSibling the next neighbour to parent, <td> that conatains isbn
  // 4. .text content: get the isbn inside the previous sibiling <td>  
  store.removeBook
  (e.target.parentElement.previousElementSibling
    .textContent);

  UI.showAlert("book removed ",'success');

 
 });

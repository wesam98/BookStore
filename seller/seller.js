// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn, description) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.description = description;
  }
}

// UI Class: Handle UI Tasks
class UI{

  static displayBooks()
  {
  const storedBooks = store.getBook();
  storedBooks.forEach((book) => {
    UI.addBookToCards(book);
  });
  }
   

  static addBookToCards(book)
  {
    const cardBody = document.querySelector('#card-body');

    // Create a card for new book
    const card = document.createElement('div');
    card.classList.add('card', 'col-md-3', 'm-2'); // for bootsrap styling

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Title: ${book.title}</h5>
        <p class="card-text">Description: ${book.description}</p>
        <p class="text-muted">Author: ${book.author}</p>
        <p class="text-muted">ISBN: ${book.isbn}</p>
        <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
      </div>
    `;
    cardBody.appendChild(card); // append card to html page

  }

  static removeBook(element){

  // Check if the clicked element has the class 'delete'
    // If yes, remove the entire book card 
    if(element.classList.contains('delete')){
      element.closest('.card').remove();
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
    document.querySelector('#description').value = '';
    document.querySelector('#isbn').value = '';

  }

}

// Store Class: Handle Local Storage
class store{

  static getBook(){
    let books; 
    if(localStorage.getItem('books') === null )
      books = [];
    else
    books = JSON.parse(localStorage.getItem('books'));
  
  return books;
 }

 static addBook(book){
  const books = this.getBook();
  books.push(book);
  localStorage.setItem('books',JSON.stringify(books));
 }

 // USE ISBN as unique Identifier to get the Book
 static removeBook(isbn){
  const books = store.getBook();

  books.forEach((book,index) => {
    if (book.isbn === isbn)
      books.splice(index,1);
    
  });
  localStorage.setItem('books',JSON.stringify(books));

 }
}

// Event: Display Book

// When the HTML page is fully loaded, call the displayBooks function to show the books.
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Remove Book
document.querySelector('#js-book-form').addEventListener('submit',(e) =>
  {
    e.preventDefault(); // Stop the form from refreshing the page
  
    //  When the user submits the form, Get form values 
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const description = document.querySelector('#description').value;
  
  
    // Validate
    if(title === '' || author === '' || isbn === ''){
      UI.showAlert('Please fill in all fields', 'danger');
    } 
    else{
      // Initiate a book
    const book = new Book(title, author, isbn, description);
  
      // Add BOOK to UI List
      UI.addBookToCards(book);
      // Add a Book to LocalStorage
      store.addBook(book);
  
      // Show Success message
      UI.showAlert('book added','success');
  
      // Clear fields
      UI.clearFields();
    }
  });

    //Event: Remove a book
  document.querySelector('#card-body').addEventListener('click',(e) => {
    // e.target return which book has been clicked, Remove from UI
    UI.removeBook(e.target);
  // Get ISBN from inside the card
  const isbn = e.target.parentElement.querySelector('.text-muted:last-of-type').textContent.replace('ISBN: ', '').trim();

  store.removeBook(isbn);

  UI.showAlert("book removed ",'success');

 
 });
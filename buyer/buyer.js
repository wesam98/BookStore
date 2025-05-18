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
  class UI {
    static displayBooks() {
      const storedBooks = Store.getBooks();
      if (storedBooks.length === 0) {
        UI.showAlert('No books available!', 'warning');
        return;
      }

      storedBooks.forEach((book) => {
        UI.addBookToCards(book);
      });
    }

    static addBookToCards(book) {
      const bookList = document.querySelector('#book-list');

      const card = document.createElement('div');
      card.classList.add('col-md-3', 'm-2');

      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.description}</p>
            <p class="text-muted">Author: ${book.author}</p>
            <p class="text-muted">ISBN: ${book.isbn}</p>
            <button class="btn btn-success btn-sm add-to-cart" data-isbn="${book.isbn}">Add to Cart</button>
          </div>
        </div>
      `;
      bookList.appendChild(card);
    }

    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      container.insertBefore(div, container.firstChild);
      setTimeout(() => div.remove(), 3000);
    }
  }

  // Store Class: Manage LocalStorage
  class Store {
    static getBooks() {
      let books;
      if (localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
    }

    static getCart() {
      let cart;
      if (localStorage.getItem('cart') === null) {
        cart = [];
      } else {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      return cart;
    }

    static addToCart(book) {
      let cart = Store.getCart();
        cart.push(book);
        localStorage.setItem('cart', JSON.stringify(cart));
      
    }
  }

  // Event: Display Books when the page is loaded
  document.addEventListener('DOMContentLoaded', UI.displayBooks);

  // Event: Add Book to Cart
  document.querySelector('#book-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const isbn = e.target.getAttribute('data-isbn');
      const books = Store.getBooks();
      const book = books.find(b => b.isbn === isbn);

      if (book) {
        Store.addToCart(book);
        UI.showAlert('Book added to cart!', 'success');
      }
    }
  });

  // Event: View Cart (only if the element exists)
  document.addEventListener('DOMContentLoaded', () => {
    const viewCartBtn = document.querySelector('#view-cart');
    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', () => {
        window.location.href = '../cart/cart.html';
      });
    }
  });


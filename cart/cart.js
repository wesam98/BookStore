// UI Class
class UI {
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    container.insertBefore(div, container.firstChild);

    // Remove after 3 sec
    setTimeout(() => div.remove(), 3000);
  }
}

// Store Class
class Store {
  static getCart() {
    let cart;
    if (localStorage.getItem('cart') === null) {
      cart = [];
    } else {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    return cart;
  }

  static removeFromCart(isbn) {
    let cart = Store.getCart();
    cart = cart.filter(book => book.isbn !== isbn);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Load and display cart items
document.addEventListener('DOMContentLoaded', () => {
  const cartItems = Store.getCart();
  const cartList = document.querySelector('#cart-list');

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="text-center">Cart is empty</p>';
  } else {
    cartItems.forEach(book => {
      const card = document.createElement('div');
      card.classList.add('col-md-3', 'm-2');
      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.description}</p>
            <p class="text-muted">Author: ${book.author}</p>
            <p class="text-muted">ISBN: ${book.isbn}</p>
            <button class="btn btn-danger btn-sm remove-from-cart" data-isbn="${book.isbn}">Remove</button>
          </div>
        </div>
      `;
      cartList.appendChild(card);
    });
  }
});

// Event: Remove from cart
document.querySelector('#cart-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-from-cart')) {
    const isbn = e.target.getAttribute('data-isbn');
    Store.removeFromCart(isbn);
    e.target.closest('.col-md-3').remove();
    UI.showAlert('Book removed from cart!', 'danger');
  }
});

// Event: Clear entire cart
document.querySelector('#clear-cart').addEventListener('click', () => {
  localStorage.removeItem('cart'); // remove from localStorage

  const cartList = document.querySelector('#cart-list');
  cartList.innerHTML = '<p class="text-center">Cart is empty</p>'; // clear UI

  UI.showAlert('All books removed from cart!', 'warning');
});
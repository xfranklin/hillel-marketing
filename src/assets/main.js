const CART_KEY = 'demo_cart';

const elements = {
  cartModal: document.querySelector('[data-cart-modal]'),
  cartCount: document.querySelector('[data-cart-count]'),
  cartItems: document.querySelector('[data-cart-items]'),
  cartTotal: document.querySelector('[data-cart-total]'),
  openButton: document.querySelector('[data-cart-open]'),
  closeButtons: Array.from(document.querySelectorAll('[data-cart-close]')),
  checkoutForm: document.querySelector('[data-checkout-form]'),
  checkoutButton: document.querySelector('[data-cart-checkout]'),
  addButtons: Array.from(document.querySelectorAll('[data-add-to-cart]')),
};

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let cart = loadCart();

function loadCart() {
  try {
    const value = localStorage.getItem(CART_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function openCart() {
  elements.cartModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeCart() {
  elements.cartModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function addToCart(productData) {
  const quantity = Number(productData.quantity || 1);
  const existing = cart.find((item) => item.id === productData.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: productData.id,
      name: productData.name,
      price: Number(productData.price),
      currency: productData.currency,
      image: productData.image,
      quantity,
    });
  }

  saveCart();
  renderCart();
}

function animateAddToCart(button) {
  if (!button) {
    return;
  }

  button.classList.remove('is-added');
  void button.offsetWidth;
  button.classList.add('is-added');

  if (elements.cartCount) {
    elements.cartCount.classList.remove('is-bumped');
    void elements.cartCount.offsetWidth;
    elements.cartCount.classList.add('is-bumped');
  }
}

function changeItemQuantity(productId, nextQuantity) {
  if (nextQuantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  } else {
    cart = cart.map((item) => (item.id === productId ? { ...item, quantity: nextQuantity } : item));
  }

  saveCart();
  renderCart();
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  elements.cartCount.textContent = String(count);
  elements.cartTotal.textContent = money.format(total);

  if (!cart.length) {
    elements.cartItems.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
    elements.checkoutButton.disabled = true;
    return;
  }

  elements.checkoutButton.disabled = false;

  elements.cartItems.innerHTML = cart
    .map(
      (item) => `
        <li class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <p>${item.name}</p>
            <p>${money.format(item.price)}</p>
            <div class="qty-controls">
              <button type="button" data-qty-dec="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty-inc="${item.id}">+</button>
              <button type="button" data-remove="${item.id}" class="remove">Remove</button>
            </div>
          </div>
        </li>
      `,
    )
    .join('');
}

async function fakeCheckout() {
  if (!cart.length) {
    return;
  }

  if (!elements.checkoutForm?.reportValidity()) {
    return;
  }

  elements.checkoutButton.disabled = true;
  elements.checkoutButton.textContent = 'Processing...';

  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  cart = [];
  saveCart();
  renderCart();
  window.location.href = '/success/';
}

function getButtonProduct(button) {
  return {
    id: button.dataset.productId,
    name: button.dataset.productName,
    price: button.dataset.productPrice,
    currency: button.dataset.productCurrency,
    image: button.dataset.productImage,
    quantity: button.dataset.productQuantity,
  };
}

function onCartItemsClick(event) {
  const incId = event.target.getAttribute('data-qty-inc');
  const decId = event.target.getAttribute('data-qty-dec');
  const removeId = event.target.getAttribute('data-remove');

  if (incId) {
    const item = cart.find((entry) => entry.id === incId);
    if (item) {
      changeItemQuantity(incId, item.quantity + 1);
    }
  }

  if (decId) {
    const item = cart.find((entry) => entry.id === decId);
    if (item) {
      changeItemQuantity(decId, item.quantity - 1);
    }
  }

  if (removeId) {
    changeItemQuantity(removeId, 0);
  }
}

function init() {
  renderCart();

  elements.openButton?.addEventListener('click', openCart);
  elements.closeButtons.forEach((button) => button.addEventListener('click', closeCart));
  elements.checkoutForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    fakeCheckout();
  });
  elements.cartItems?.addEventListener('click', onCartItemsClick);

  elements.addButtons.forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(getButtonProduct(button));
      animateAddToCart(button);
    });
  });
}

init();

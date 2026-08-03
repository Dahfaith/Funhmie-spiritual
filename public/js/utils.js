/**
 * utils.js — Shared utilities, constants, and cart management
 */

// WhatsApp numbers by region
export const WA_NUMBERS = {
  UK:      '447943272102',
  Nigeria: '2349060961825',
};

// Product categories
export const CATEGORIES = [
  'Soaps',
  'Oils/Perfumes/Waters',
  'Beads & Anklets',
  'Kits & Packages',
  'Special Consultative Work',
  'VIP Package',
];

// Service types for booking form
export const SERVICE_TYPES = [
  'Online Consultation',
  'Video Call Session',
  'Physical Consultation (UK only)',
  'Product Enquiry',
  'Special Work / Consultative Work',
  'VIP Package',
  'Other',
];

// ── Cart ──────────────────────────────────────────────────────────────────────
const CART_KEY = 'fsv_cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  notifyCartObservers();
}

const cartObservers = [];

export function onCartChange(fn) {
  cartObservers.push(fn);
}

function notifyCartObservers() {
  cartObservers.forEach(fn => fn(loadCart()));
}

/** Returns a copy of the current cart items. */
export function getCart() { return loadCart(); }

/** Total number of distinct line items (not quantities). */
export function getCartCount() { return loadCart().length; }

/** Add a product to cart (or increment qty if already present). */
export function addToCart(product) {
  const items = loadCart();
  const idx   = items.findIndex(i => i.id === product.id);
  if (idx > -1) {
    items[idx].qty += 1;
  } else {
    items.push({
      id:        product.id,
      name:      product.name,
      category:  product.category,
      price_gbp: product.price_gbp,
      price_ngn: product.price_ngn,
      image_url: product.image_url,
      qty: 1,
    });
  }
  saveCart(items);
}

/** Remove a product from cart entirely. */
export function removeFromCart(productId) {
  saveCart(loadCart().filter(i => i.id !== productId));
}

/** Set a specific quantity (removes if qty <= 0). */
export function setCartQty(productId, qty) {
  if (qty <= 0) { removeFromCart(productId); return; }
  const items = loadCart();
  const idx   = items.findIndex(i => i.id === productId);
  if (idx > -1) { items[idx].qty = qty; saveCart(items); }
}

/** Empty the whole cart. */
export function clearCart() { saveCart([]); }

/**
 * Build a WhatsApp enquiry link.
 * @param {'UK'|'Nigeria'} region
 * @param {string} productName
 */
export function buildWhatsAppLink(region, productName) {
  const number  = WA_NUMBERS[region] ?? WA_NUMBERS.UK;
  const message = encodeURIComponent(
    `Hello Fuhmie Spiritual Venture,\n\nI'm interested in *${productName}*. Could you please provide more details and availability?\n\nThank you.`
  );
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Build a generic WhatsApp booking link.
 */
export function buildBookingWhatsAppLink(region) {
  const number  = WA_NUMBERS[region] ?? WA_NUMBERS.UK;
  const message = encodeURIComponent(
    `Hello Fuhmie Spiritual Venture, I'd like to book a consultation. Please guide me on the next steps.`
  );
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Build a WhatsApp checkout link from cart items.
 * @param {'UK'|'Nigeria'} region
 * @param {Array} cartItems
 */
export function buildCartWhatsAppLink(region, cartItems) {
  const number   = WA_NUMBERS[region] ?? WA_NUMBERS.UK;
  const currency = region === 'Nigeria' ? 'NGN' : 'GBP';
  const lines    = cartItems.map(item => {
    const price = currency === 'GBP' ? item.price_gbp : item.price_ngn;
    const priceStr = price != null ? formatPrice(price * item.qty, currency) : 'POA';
    return `• ${item.qty}× ${item.name} — ${priceStr}`;
  });
  const message = encodeURIComponent(
    `Hello Fuhmie Spiritual Venture,\n\nI'd like to order the following:\n\n${lines.join('\n')}\n\nPlease confirm availability and payment details. Thank you.`
  );
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Format a number as GBP or NGN.
 * @param {number|null} amount
 * @param {'GBP'|'NGN'} currency
 */
export function formatPrice(amount, currency) {
  if (amount == null) return null;
  if (currency === 'GBP') {
    return '£' + Number(amount).toLocaleString('en-GB', { minimumFractionDigits: 0 });
  }
  return '₦' + Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 0 });
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'} type
 */
export function toast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

/**
 * Inline SVG frond/leaf divider.
 * @param {string} [extraClass]
 */
export function frondSVG(extraClass = '') {
  return `<svg class="frond-divider ${extraClass}" viewBox="0 0 280 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">
    <g stroke="#8FAF9C" stroke-linecap="round">
      <path d="M140 24 C120 24 100 24 70 24" stroke-width="1"/>
      <path d="M140 24 C160 24 180 24 210 24" stroke-width="1"/>
      <path d="M115 24 C110 16 104 11 96 9" stroke-width="0.8"/>
      <path d="M105 24 C99 14 92 9 83 7" stroke-width="0.8"/>
      <path d="M95 24 C87 15 79 11 70 10" stroke-width="0.8"/>
      <path d="M125 24 C121 18 117 14 112 12" stroke-width="0.7"/>
      <path d="M165 24 C170 16 176 11 184 9" stroke-width="0.8"/>
      <path d="M175 24 C181 14 188 9 197 7" stroke-width="0.8"/>
      <path d="M185 24 C193 15 201 11 210 10" stroke-width="0.8"/>
      <path d="M155 24 C159 18 163 14 168 12" stroke-width="0.7"/>
      <path d="M140 24 C138 14 136 7 134 2" stroke-width="1"/>
      <path d="M140 24 C142 14 144 7 146 2" stroke-width="1"/>
      <circle cx="140" cy="24" r="2.5" fill="#8FAF9C" stroke="none"/>
    </g>
  </svg>`;
}

/**
 * Escape HTML to prevent XSS in dynamic content.
 */
export function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + (dateStr.includes('Z') ? '' : 'Z'));
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Debounce a function.
 */
export function debounce(fn, ms = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

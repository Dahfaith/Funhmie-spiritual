/**
 * cart.js — Shopping cart page with order checkout
 */
import { api } from '../api.js';
import {
  getCart, removeFromCart, setCartQty, clearCart,
  formatPrice, buildCartWhatsAppLink, escHtml, toast,
} from '../utils.js';

// Active region/currency for the cart
let cartRegion = 'UK';
let bankSettings = { 
  bank_name: 'Moniepoint MFB', 
  account_name: 'Fuhmie Spiritual Venture', 
  account_number: '1234567890' 
};

function cartIsEmpty() {
  const items = getCart();
  return !items || items.length === 0;
}

function cartTotal(items, currency) {
  return items.reduce((sum, item) => {
    const price = currency === 'GBP' ? item.price_gbp : item.price_ngn;
    return sum + (price != null ? price * item.qty : 0);
  }, 0);
}

function lineHTML(item, currency) {
  const price    = currency === 'GBP' ? item.price_gbp : item.price_ngn;
  const lineTotal = price != null ? formatPrice(price * item.qty, currency) : '—';
  const unitPrice = price != null ? formatPrice(price, currency) : 'POA';

  const img = item.image_url
    ? `<img src="${escHtml(item.image_url)}" alt="${escHtml(item.name)}" style="width:60px;height:60px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--hairline);flex-shrink:0;"/>`
    : `<div style="width:60px;height:60px;background:var(--sage-light);border-radius:var(--radius-sm);border:1px solid var(--hairline);flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#8FAF9C" stroke-width="1" width="24" height="24"><circle cx="12" cy="12" r="9"/><path d="M12 7c0 0-3 3-3 6 0 2 1.3 3 3 3s3-1 3-3c0-3-3-6-3-6z"/></svg>
       </div>`;

  return `
    <tr class="cart-row" data-id="${item.id}">
      <td class="cart-row__product">
        ${img}
        <div class="cart-row__info">
          <div class="cart-row__name">${escHtml(item.name)}</div>
          <div class="cart-row__cat">${escHtml(item.category)}</div>
          <div class="cart-row__unit-price">${unitPrice} each</div>
        </div>
      </td>
      <td class="cart-row__qty">
        <div class="qty-control">
          <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn qty-plus"  data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td class="cart-row__total">${lineTotal}</td>
      <td class="cart-row__remove">
        <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove item">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M4 6h12M8 6V4h4v2M16 6l-1 11H5L4 6"/></svg>
        </button>
      </td>
    </tr>
  `;
}

function renderCartTable() {
  const items    = getCart();
  const currency = cartRegion === 'Nigeria' ? 'NGN' : 'GBP';
  const wrap     = document.getElementById('cart-content');
  if (!wrap) return;

  if (items.length === 0) {
    wrap.innerHTML = emptyCartHTML();
    return;
  }

  const total    = cartTotal(items, currency);
  const totalStr = total > 0 ? formatPrice(total, currency) : '—';
  const waLink   = buildCartWhatsAppLink(cartRegion, items);

  wrap.innerHTML = `
    <div class="cart-grid">
      <!-- Items table -->
      <div class="cart-items-col">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="cart-tbody">
            ${items.map(i => lineHTML(i, currency)).join('')}
          </tbody>
        </table>

        <div class="cart-clear-row">
          <button class="btn btn-outline btn-sm" id="cart-clear-btn">Clear cart</button>
        </div>
      </div>

      <!-- Summary + checkout -->
      <div class="cart-summary-col">
        <div class="cart-summary-box">
          <div class="cart-summary__region">
            <span style="font-size:var(--text-sm);color:var(--ink-soft);">Prices shown in:</span>
            <div class="region-toggle" style="margin-top:var(--space-2);">
              <button class="region-toggle__btn${cartRegion === 'UK' ? ' active' : ''}" data-region="UK">🇬🇧 £ GBP</button>
              <button class="region-toggle__btn${cartRegion === 'Nigeria' ? ' active' : ''}" data-region="Nigeria">🇳🇬 ₦ NGN</button>
            </div>
          </div>

          <div class="cart-summary__total-row">
            <span>Order Total</span>
            <span class="cart-summary__total-val" id="cart-total">${totalStr}</span>
          </div>
          <p class="cart-summary__note">
            Prices are indicative. Final amount confirmed after your order is reviewed. Delivery charges may apply.
          </p>

          <!-- Checkout form -->
          <form id="cart-checkout-form" class="cart-checkout-form">
            <h3 class="cart-checkout-form__title">Place Your Order</h3>

            <div class="form-group">
              <label class="form-label" for="co-name">Full Name</label>
              <input class="form-input" id="co-name" name="name" type="text" placeholder="Your full name" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="co-phone">WhatsApp / Phone</label>
              <input class="form-input" id="co-phone" name="phone" type="tel" placeholder="+44 or +234 number" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="co-region">Your Region</label>
              <select class="form-input" id="co-region" name="region" required>
                <option value="">— Select region —</option>
                <option value="UK" ${cartRegion === 'UK' ? 'selected' : ''}>United Kingdom</option>
                <option value="Nigeria" ${cartRegion === 'Nigeria' ? 'selected' : ''}>Nigeria</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-address">Delivery Address</label>
              <textarea class="form-input" id="co-address" name="address" rows="2" placeholder="Full delivery address" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="co-notes">Notes (optional)</label>
              <textarea class="form-input" id="co-notes" name="notes" rows="2" placeholder="Any special requests or questions…"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;" id="co-submit-btn">
              Submit Order
            </button>
          </form>

          <div class="cart-summary__divider">
            <span>or</span>
          </div>

          <button type="button" class="btn btn-outline" id="cart-wa-btn" style="width:100%;justify-content:center;">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path d="M10 0C4.477 0 0 4.477 0 10c0 1.763.463 3.415 1.268 4.847L0 20l5.305-1.245A9.96 9.96 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.823 13.9c-.2.56-1.17 1.07-1.61 1.14-.41.065-.93.09-1.5-.1-.35-.115-.8-.27-1.37-.525-2.41-1.04-3.98-3.49-4.1-3.65-.12-.16-.97-1.29-.97-2.46 0-1.17.61-1.745.83-1.985.22-.24.48-.3.64-.3.16 0 .32.002.46.008.15.007.35-.057.55.42.2.48.68 1.655.74 1.775.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14z"/></svg>
            Checkout via WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- WhatsApp Payment Modal -->
    <div id="wa-payment-modal" class="modal-overlay" style="display:none;">
      <div class="modal-content">
        <h3 style="margin-bottom:var(--space-2);color:var(--forest);font-family:var(--font-display);">Make Payment</h3>
        <p style="font-size:var(--text-sm);color:var(--ink-soft);margin-bottom:var(--space-4);">
          Please transfer your order total (<strong>${totalStr}</strong>) to the account below, then proceed to WhatsApp to send your payment proof and delivery details.
        </p>
        <form id="wa-payment-form">
          <div style="background:var(--cream);padding:var(--space-4);border-radius:var(--radius-sm);margin-bottom:var(--space-4);">
            <div style="margin-bottom:var(--space-2);font-size:var(--text-sm);"><strong style="color:var(--forest);">Bank:</strong> ${escHtml(bankSettings.bank_name)}</div>
            <div style="margin-bottom:var(--space-2);font-size:var(--text-sm);"><strong style="color:var(--forest);">Account Name:</strong> ${escHtml(bankSettings.account_name)}</div>
            <div style="font-size:var(--text-sm);"><strong style="color:var(--forest);">Account Number:</strong> ${escHtml(bankSettings.account_number)}</div>
          </div>
          <div class="form-group" style="margin-bottom:var(--space-4);text-align:left;">
            <label class="form-label" for="wa-payment-proof">Upload Payment Receipt</label>
            <input class="form-input" id="wa-payment-proof" type="file" accept="image/*" required />
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Submit & Notify on WhatsApp</button>
            <button type="button" class="btn btn-outline" id="wa-modal-close" style="width:100%;justify-content:center;">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  wireCartEvents(items, currency);
}

function emptyCartHTML() {
  return `
    <div class="cart-empty">
      <svg viewBox="0 0 64 64" fill="none" stroke="#8FAF9C" stroke-width="1.2" width="72" height="72">
        <path d="M8 8h6l8 30h28l6-22H20"/>
        <circle cx="28" cy="52" r="3"/>
        <circle cx="44" cy="52" r="3"/>
      </svg>
      <h2>Your cart is empty</h2>
      <p>Add some products from the shop to get started.</p>
      <a href="#shop" class="btn btn-primary btn-lg">Browse the Shop</a>
    </div>
  `;
}

function wireCartEvents(items, currency) {
  // Qty controls
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = parseInt(btn.dataset.id);
      const item = items.find(i => i.id === id);
      if (item) setCartQty(id, item.qty - 1);
      renderCartTable();
    });
  });

  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = parseInt(btn.dataset.id);
      const item = items.find(i => i.id === id);
      if (item) setCartQty(id, item.qty + 1);
      renderCartTable();
    });
  });

  // Remove buttons
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(parseInt(btn.dataset.id));
      renderCartTable();
    });
  });

  // Clear cart
  const clearBtn = document.getElementById('cart-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Remove all items from your cart?')) {
        clearCart();
        renderCartTable();
      }
    });
  }

  // Region toggle
  document.querySelectorAll('.cart-summary-box .region-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cart-summary-box .region-toggle__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cartRegion = btn.dataset.region;
      // Update co-region select if present
      const sel = document.getElementById('co-region');
      if (sel) sel.value = cartRegion;
      renderCartTable();
    });
  });

  // Checkout form
  const form = document.getElementById('cart-checkout-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn     = document.getElementById('co-submit-btn');
      const cartNow = getCart();
      if (cartNow.length === 0) return;

      const cur = cartRegion === 'Nigeria' ? 'NGN' : 'GBP';
      const lines = cartNow.map(item => {
        const p     = cur === 'GBP' ? item.price_gbp : item.price_ngn;
        const total = p != null ? formatPrice(p * item.qty, cur) : 'POA';
        return `${item.qty}x ${item.name} (${total})`;
      }).join('; ');

      const formData = new FormData();
      formData.append('name', form.querySelector('#co-name').value.trim());
      formData.append('phone', form.querySelector('#co-phone').value.trim());
      formData.append('region', form.querySelector('#co-region').value);
      formData.append('service_type', 'Product Order');
      formData.append('notes', `ORDER: ${lines}\n\nDelivery Address:\n${form.querySelector('#co-address').value.trim()}${form.querySelector('#co-notes').value.trim() ? '\n\nNotes: ' + form.querySelector('#co-notes').value.trim() : ''}`);
      formData.append('items', JSON.stringify(cartNow));

      btn.disabled    = true;
      btn.textContent = 'Submitting…';

      try {
        await api.bookings.submit(formData, true);
        clearCart();
        const wrap = document.getElementById('cart-content');
        if (wrap) {
          wrap.innerHTML = `
            <div class="cart-empty">
              <svg viewBox="0 0 64 64" fill="none" stroke="var(--pine)" stroke-width="1.5" width="72" height="72">
                <circle cx="32" cy="32" r="28"/>
                <path d="M20 32l8 8 16-16" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 style="color:var(--pine);">Order Received!</h2>
              <p>Thank you — we'll contact you on <strong>${escHtml(formData.phone)}</strong> to confirm your order and payment details.</p>
              <a href="#shop" class="btn btn-primary btn-lg">Continue Shopping</a>
            </div>
          `;
        }
      } catch (err) {
        toast('Something went wrong — please try again or use WhatsApp.', 'error');
        btn.disabled    = false;
        btn.textContent = 'Submit Order';
      }
    });
  }

  // WhatsApp Modal Toggle
  const waBtn = document.getElementById('cart-wa-btn');
  const waModal = document.getElementById('wa-payment-modal');
  const waForm = document.getElementById('wa-payment-form');
  const waClose = document.getElementById('wa-modal-close');

  if (waBtn && waModal && waClose) {
    waBtn.addEventListener('click', () => {
      // Require main form to be filled out first
      const mainForm = document.getElementById('cart-checkout-form');
      if (mainForm && !mainForm.checkValidity()) {
        mainForm.reportValidity();
        toast('Please fill out your details and delivery address first.', 'error');
        return;
      }
      waModal.style.display = 'flex';
    });
    waClose.addEventListener('click', () => {
      waModal.style.display = 'none';
    });
    waModal.addEventListener('click', (e) => {
      if (e.target === waModal) waModal.style.display = 'none';
    });
    if (waForm) {
      waForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mainForm = document.getElementById('cart-checkout-form');
        const submitBtn = waForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const fileInput = document.getElementById('wa-payment-proof');
        const cartNow = getCart();
        const cur = cartRegion === 'Nigeria' ? 'NGN' : 'GBP';
        const lines = cartNow.map(item => {
          const p = cur === 'GBP' ? item.price_gbp : item.price_ngn;
          const total = p != null ? formatPrice(p * item.qty, cur) : 'POA';
          return `${item.qty}x ${item.name} (${total})`;
        }).join('; ');

        const fd = new FormData();
        fd.append('name', mainForm.querySelector('#co-name').value.trim());
        fd.append('phone', mainForm.querySelector('#co-phone').value.trim());
        fd.append('region', mainForm.querySelector('#co-region').value);
        fd.append('service_type', 'WhatsApp Checkout');
        fd.append('notes', `ORDER: ${lines}\n\nDelivery Address:\n${mainForm.querySelector('#co-address').value.trim()}`);
        fd.append('items', JSON.stringify(cartNow));
        
        if (fileInput.files.length > 0) {
          fd.append('payment_proof', fileInput.files[0]);
        }

        try {
          await api.bookings.submit(fd, true);
          const waLink = buildCartWhatsAppLink(cartRegion, cartNow);
          window.open(waLink, '_blank');
          clearCart();
          window.location.reload();
        } catch (err) {
          toast('Failed to log order. ' + err.message, 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit & Notify on WhatsApp';
        }
      });
    }
  }
}

export async function renderCart() {
  return `
    <!-- Page header -->
    <div class="page-header">
      <div class="container page-header__inner">
        <div class="page-header__label">Your Selection</div>
        <h1 class="page-header__title">Cart &amp; Checkout</h1>
        <p class="page-header__sub">Review your items, adjust quantities, then submit your order or send it via WhatsApp.</p>
      </div>
    </div>

    <section class="section">
      <div class="container" id="cart-content">
        <div class="spinner"></div>
      </div>
    </section>
  `;
}

// Run after HTML is injected
window.__cartInit = async function() {
  try {
    const fetched = await api.settings.get();
    if (fetched && fetched.bank_name) {
      bankSettings = fetched;
    }
  } catch (err) {
    console.error('Failed to load bank settings', err);
  }
  renderCartTable();
};

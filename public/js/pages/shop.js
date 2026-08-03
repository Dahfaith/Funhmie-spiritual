/**
 * shop.js — Shop page with category filter, region/currency toggle, cart, and WhatsApp enquiry
 */
import { api }           from '../api.js';
import { CATEGORIES, frondSVG, formatPrice, buildWhatsAppLink, escHtml, addToCart, toast } from '../utils.js';

// State (module-level so init() can reference)
let allProducts = [];
let currentRegion   = 'UK';      // 'UK' | 'Nigeria'
let currentCategory = 'All';

function placeholderSVG() {
  return `<svg viewBox="0 0 48 48" fill="none" stroke="#8FAF9C" stroke-width="1" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18"/>
    <path d="M24 14 C24 14 18 20 18 26 C18 30 20.7 32 24 32 C27.3 32 30 30 30 26 C30 20 24 14 24 14Z" stroke-width="1.2"/>
    <path d="M17 30 C14 28 12 25 12 21"/>
    <path d="M31 30 C34 28 36 25 36 21"/>
  </svg>`;
}

function productCardHTML(p) {
  const currency = currentRegion === 'Nigeria' ? 'NGN' : 'GBP';
  const priceVal = currentRegion === 'Nigeria' ? p.price_ngn : p.price_gbp;
  const priceStr = priceVal != null ? formatPrice(priceVal, currency) : null;
  const waLink   = buildWhatsAppLink(currentRegion, p.name);

  const img = p.image_url
    ? `<img src="${escHtml(p.image_url)}" alt="${escHtml(p.name)}" loading="lazy"/>`
    : `<div class="product-card__image-placeholder">${placeholderSVG()}<span style="font-size:0.7rem;color:var(--sage);">Image coming soon</span></div>`;

  return `
    <article class="card product-card">
      <div class="product-card__image">${img}</div>
      <div class="product-card__body">
        <span class="product-card__cat">${escHtml(p.category)}</span>
        <h3 class="product-card__name">${escHtml(p.name)}</h3>
        ${priceStr
          ? `<div class="product-card__price">${escHtml(priceStr)}</div>`
          : `<div class="product-card__price-contact">Contact for UK price</div>`
        }
      </div>
      <div class="product-card__footer">
        <button class="btn btn-primary btn-sm product-card__add-btn"
                style="width:100%;justify-content:center;"
                data-id="${p.id}"
                data-product='${escHtml(JSON.stringify(p))}'>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M10 4v12M4 10h12"/></svg>
          Add to Cart
        </button>
        <a href="${waLink}" target="_blank" rel="noopener"
           class="btn btn-outline btn-sm product-card__wa-btn"
           style="width:100%;justify-content:center;margin-top:var(--space-2);">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13" style="flex-shrink:0"><path d="M10 0C4.477 0 0 4.477 0 10c0 1.763.463 3.415 1.268 4.847L0 20l5.305-1.245A9.96 9.96 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm4.823 13.9c-.2.56-1.17 1.07-1.61 1.14-.41.065-.93.09-1.5-.1-.35-.115-.8-.27-1.37-.525-2.41-1.04-3.98-3.49-4.1-3.65-.12-.16-.97-1.29-.97-2.46 0-1.17.61-1.745.83-1.985.22-.24.48-.3.64-.3.16 0 .32.002.46.008.15.007.35-.057.55.42.2.48.68 1.655.74 1.775.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14z"/></svg>
          Quick Enquiry
        </a>
      </div>
    </article>
  `;
}

function filteredProducts() {
  if (currentCategory === 'All') return allProducts;
  return allProducts.filter(p => p.category === currentCategory);
}

function renderGrid() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  const products = filteredProducts();
  if (products.length === 0) {
    grid.innerHTML = `<p class="text-center" style="grid-column:1/-1;padding:var(--space-10) 0;color:var(--ink-soft);">No products in this category yet.</p>`;
    return;
  }
  grid.innerHTML = products.map(productCardHTML).join('');

  // Wire up Add to Cart buttons
  grid.querySelectorAll('.product-card__add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = JSON.parse(btn.dataset.product);
      addToCart(product);
      toast(`"${product.name}" added to cart ✓`, 'success');
      // Micro-animation on button
      btn.textContent = '✓ Added';
      btn.style.background = 'var(--pine)';
      btn.style.borderColor = 'var(--pine)';
      setTimeout(() => {
        btn.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M10 4v12M4 10h12"/></svg> Add to Cart`;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 1400);
    });
  });
}

function updateCount() {
  const el = document.getElementById('shop-count');
  if (el) el.textContent = `${filteredProducts().length} products`;
}

export async function renderShop() {
  try {
    allProducts = await api.products.list();
  } catch {
    allProducts = [];
  }

  // Set up init hook for after HTML is inserted
  window.__pageInit = function initShop() {
    // Category pills
    document.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.cat;
        renderGrid();
        updateCount();
      });
    });

    // Region toggle
    document.querySelectorAll('.region-toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.region-toggle__btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRegion = btn.dataset.region;
        // Update currency label
        const label = document.getElementById('currency-label');
        if (label) label.textContent = currentRegion === 'Nigeria' ? '₦ Nigerian Naira' : '£ British Pound';
        renderGrid();
      });
    });

    renderGrid();
    updateCount();
  };

  const catOptions = ['All', ...CATEGORIES];

  return `
    <!-- ── Page header ── -->
    <div class="page-header">
      <div class="container page-header__inner">
        <div class="page-header__label">Products &amp; Remedies</div>
        <h1 class="page-header__title">The Shop</h1>
        <p class="page-header__sub">
          Browse our full range of spiritual products. Select your region to see prices, add items to your cart, and place an order.
        </p>
      </div>
    </div>

    <!-- ── Sticky toolbar ── -->
    <div class="shop-toolbar">
      <div class="shop-toolbar__inner">
        <!-- Category filter -->
        <div class="filter-strip" style="margin-bottom:0;">
          ${catOptions.map(cat => `
            <button class="filter-pill${cat === 'All' ? ' active' : ''}" data-cat="${escHtml(cat)}">
              ${escHtml(cat)}
            </button>
          `).join('')}
        </div>

        <!-- Region toggle + cart shortcut -->
        <div style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:var(--space-3);">
            <span id="currency-label" style="font-size:var(--text-sm);color:var(--ink-soft);">£ British Pound</span>
            <div class="region-toggle">
              <button class="region-toggle__btn active" data-region="UK">🇬🇧 UK</button>
              <button class="region-toggle__btn" data-region="Nigeria">🇳🇬 Nigeria</button>
            </div>
          </div>
          <a href="#cart" class="btn btn-outline btn-sm" style="white-space:nowrap;">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M6 2L3 6v14a2 2 0 002 2h10a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="17" y2="6"/><path d="M13 10a3 3 0 01-6 0"/></svg>
            View Cart
          </a>
        </div>
      </div>
    </div>

    <!-- ── Grid ── -->
    <section class="section">
      <div class="container">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
          <span id="shop-count" style="font-size:var(--text-sm);color:var(--ink-soft);"></span>
        </div>
        <div class="grid-4" id="shop-grid">
          <div class="spinner"></div>
        </div>
      </div>
    </section>

    <!-- ── Bottom CTA ── -->
    <section class="section--sm section--dark">
      <div class="container text-center">
        <p style="color:var(--sage);margin:0 auto var(--space-5);">Can't find what you're looking for? Contact us directly.</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
          <a href="https://wa.me/447943272102" target="_blank" rel="noopener" class="btn btn-primary">WhatsApp UK</a>
          <a href="https://wa.me/2349060961825" target="_blank" rel="noopener" class="btn btn-outline-light">WhatsApp Nigeria</a>
        </div>
      </div>
    </section>
  `;
}

/**
 * home.js — Home page
 */
import { api }           from '../api.js';
import { frondSVG, formatPrice, buildWhatsAppLink, escHtml, addToCart, toast } from '../utils.js';

function productCardHTML(p, region) {
  const currency = region === 'Nigeria' ? 'NGN' : 'GBP';
  const priceVal = region === 'Nigeria' ? p.price_ngn : p.price_gbp;
  const priceStr = priceVal != null ? formatPrice(priceVal, currency) : 'Contact for price';

  const img = p.image_url
    ? `<img src="${escHtml(p.image_url)}" alt="${escHtml(p.name)}" loading="lazy"/>`
    : `<div class="product-card__image-placeholder">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="24" cy="24" r="18"/>
          <path d="M24 14 C24 14 18 20 18 26 C18 30 20.7 32 24 32 C27.3 32 30 30 30 26 C30 20 24 14 24 14Z" stroke-width="1.2"/>
          <path d="M17 30 C14 28 12 25 12 21"/>
          <path d="M31 30 C34 28 36 25 36 21"/>
        </svg>
        <span style="font-size:0.7rem;color:var(--sage);">No image</span>
      </div>`;

  const waLink = buildWhatsAppLink(region, p.name);
  return `
    <article class="card product-card" data-id="${p.id}">
      <div class="product-card__image">${img}</div>
      <div class="product-card__body">
        <span class="product-card__cat">${escHtml(p.category)}</span>
        <h3 class="product-card__name">${escHtml(p.name)}</h3>
        <div class="product-card__price">${escHtml(priceStr)}</div>
      </div>
      <div class="product-card__footer">
        <button class="btn btn-primary btn-sm product-card__add-btn"
                style="width:100%;justify-content:center;"
                data-product='${escHtml(JSON.stringify(p))}'>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M10 4v12M4 10h12"/></svg>
          Add to Cart
        </button>
        <a href="${waLink}" target="_blank" rel="noopener"
           class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:var(--space-2);">
          Quick Enquiry
        </a>
      </div>
    </article>
  `;
}

export async function renderHome() {
  // Fetch featured products (first 6)
  let featured = [];
  try {
    const all = await api.products.list();
    featured = all.slice(0, 6);
  } catch { /* show empty gracefully */ }

  const region = 'UK'; // Home page defaults to UK

  // Wire up Add to Cart buttons after render
  window.__pageInit = function initHome() {
    document.querySelectorAll('#featured-grid .product-card__add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = JSON.parse(btn.dataset.product);
        addToCart(product);
        toast(`"${product.name}" added to cart ✓`, 'success');
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
  };

  return `
    <!-- ── Hero ── -->
    <section class="hero" aria-label="Hero">
      <div class="hero__pattern" aria-hidden="true"></div>
      <div class="container hero__inner">
        <span class="hero__label">Spiritual Consultations &amp; Traditional Remedies</span>
        <h1 class="hero__heading">
          Rooted in tradition.<br/>
          <em>Guided by wisdom.</em>
        </h1>
        <p class="hero__subtext">
          Serving clients in Nigeria and the United Kingdom with authentic spiritual consultations,
          traditional remedy products, and confidential one-to-one guidance.
        </p>
        <div class="hero__ctas">
          <a href="#contact" class="btn btn-primary btn-lg">Book a Consultation</a>
          <a href="#shop"    class="btn btn-outline-light btn-lg">Browse Products</a>
        </div>
      </div>
    </section>

    <!-- ── Trust strip ── -->
    <section class="section--sm" style="background:var(--white);">
      <div class="container">
        <div class="trust-strip">
          <div class="trust-item">
            <svg class="trust-item__icon" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
              <circle cx="18" cy="18" r="14"/>
              <path d="M12 18l4 4 8-8"/>
            </svg>
            <div>
              <div class="trust-item__title">Diaspora Specialists</div>
              <div class="trust-item__body">Serving UK &amp; Nigerian clients with tailored products and remote consultations.</div>
            </div>
          </div>
          <div class="trust-item">
            <svg class="trust-item__icon" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
              <rect x="6" y="8" width="24" height="20" rx="2"/>
              <path d="M6 13h24"/>
              <path d="M13 8V6M23 8V6"/>
            </svg>
            <div>
              <div class="trust-item__title">Flexible Booking</div>
              <div class="trust-item__body">Book online, via video call, or in person at our UK locations in Crewe, Manchester &amp; Liverpool.</div>
            </div>
          </div>
          <div class="trust-item">
            <svg class="trust-item__icon" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
              <path d="M18 4l3.5 7 7.5 1.1-5.5 5.3 1.3 7.6L18 21.5l-6.8 3.5 1.3-7.6L7 12.1l7.5-1.1z"/>
            </svg>
            <div>
              <div class="trust-item__title">Trusted &amp; Confidential</div>
              <div class="trust-item__body">Every session is private. All products are prepared and dispatched with care and discretion.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── How it works ── -->
    <section class="section" style="background:var(--cream);">
      <div class="container">
        <div class="section__header">
          <span class="section__label">The process</span>
          <h2>How it works</h2>
          <p>Getting started is straightforward. Here's what to expect from your first contact to receiving your remedy or consultation outcome.</p>
        </div>
        ${frondSVG()}
        <div class="steps">
          <div class="step">
            <div class="step__number">01</div>
            <div class="step__title">Reach Out</div>
            <p class="step__body">Book directly through our website or send a WhatsApp message. Tell us what you're dealing with — we keep everything completely confidential.</p>
          </div>
          <div class="step">
            <div class="step__number">02</div>
            <div class="step__title">Consultation</div>
            <p class="step__body">We'll discuss your situation and identify the right product or spiritual work for your needs — online, by video call, or in person.</p>
          </div>
          <div class="step">
            <div class="step__number">03</div>
            <div class="step__title">Receive &amp; Experience</div>
            <p class="step__body">Products are dispatched to your address (UK &amp; Nigeria). Spiritual work begins as agreed. You'll know exactly what to do and when.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Featured Products ── -->
    <section class="section" style="background:var(--sage-light);">
      <div class="container">
        <div class="section__header centered text-center">
          <span class="section__label">From the shop</span>
          <h2>Featured Products</h2>
          <p>A selection from our full range. Browse the complete catalogue for all categories, pricing, and WhatsApp enquiry links.</p>
        </div>
        ${frondSVG()}

        ${featured.length > 0
          ? `<div class="grid-3" id="featured-grid">
               ${featured.map(p => productCardHTML(p, region)).join('')}
             </div>`
          : `<p class="text-center" style="margin-top:var(--space-8);">Products loading…</p>`
        }

        <div style="text-align:center;margin-top:var(--space-10);">
          <a href="#shop" class="btn btn-outline btn-lg">View All Products</a>
        </div>
      </div>
    </section>

    <!-- ── CTA Banner ── -->
    <section class="section section--dark">
      <div class="container text-center">
        <span class="section__label">Ready to begin?</span>
        <h2 style="color:var(--cream);margin-bottom:var(--space-4);">Book your consultation today</h2>
        <p style="color:var(--sage);margin:0 auto var(--space-8);">
          Whether you're in Nigeria or the UK, we're here to help. Consultations are available online, by video call, or in person.
        </p>
        ${frondSVG()}
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-6);">
          <a href="#contact" class="btn btn-primary btn-lg">Book Now</a>
          <a href="#services" class="btn btn-outline-light btn-lg">View Pricing</a>
        </div>
      </div>
    </section>
  `;
}

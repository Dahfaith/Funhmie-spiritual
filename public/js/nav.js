/**
 * nav.js — Sticky navigation component
 */
import { frondSVG, getCartCount, onCartChange } from './utils.js';

const LINKS = [
  { href: '#home',          label: 'Home'          },
  { href: '#shop',          label: 'Shop'          },
  { href: '#services',      label: 'Consultations' },
  { href: '#about',         label: 'About'         },
  { href: '#contact',       label: 'Contact'       },
];

function logoMark() {
  return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
    <circle cx="16" cy="12" r="5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M16 18 C16 18 10 22 10 27 C10 27 13 26 16 26 C19 26 22 27 22 27 C22 22 16 18 16 18Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M9 22 C6 20 4 17 4 14 C4 8.5 9.4 4 16 4 C22.6 4 28 8.5 28 14 C28 17 26 20 23 22" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
  </svg>`;
}

function cartIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>`;
}

function renderLinks(active) {
  return LINKS.map(l => `
    <a href="${l.href}"
       class="site-nav__link${active === l.href ? ' active' : ''}"
       data-nav-link="${l.href}">
      ${l.label}
    </a>
  `).join('');
}

function cartBadgeHtml(count) {
  return count > 0
    ? `<span class="cart-badge" id="cart-badge">${count > 99 ? '99+' : count}</span>`
    : `<span class="cart-badge cart-badge--hidden" id="cart-badge"></span>`;
}

export function mountNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const currentHash = () => window.location.hash || '#home';
  const cartCount   = getCartCount();

  header.innerHTML = `
    <nav class="site-nav" role="navigation" aria-label="Main navigation">
      <div class="site-nav__inner">
        <a href="#home" class="site-nav__logo" data-nav-link="#home" aria-label="Fuhmie Spiritual Venture — Home">
          <span class="site-nav__logo-mark">${logoMark()}</span>
          <span class="site-nav__logo-text">
            <span class="site-nav__logo-name">Fuhmie Spiritual</span>
            <span class="site-nav__logo-tagline">Venture</span>
          </span>
        </a>

        <div class="site-nav__links">
          ${renderLinks(currentHash())}
        </div>

        <div class="site-nav__actions">
          <!-- Cart button -->
          <a href="#cart" class="site-nav__cart-btn" id="nav-cart-btn" aria-label="View cart" data-nav-link="#cart">
            ${cartIcon()}
            ${cartBadgeHtml(cartCount)}
          </a>

          <a href="#contact" class="site-nav__cta btn btn-primary btn-sm" data-nav-link="#contact">
            Book Now
          </a>

          <button class="site-nav__hamburger" aria-label="Toggle menu" aria-expanded="false" id="nav-hamburger">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="site-nav__mobile" id="nav-mobile" role="menu">
        ${renderLinks(currentHash())}
        <a href="#cart" class="site-nav__link" data-nav-link="#cart">🛒 Cart</a>
        <a href="#contact" class="btn btn-primary btn-sm" data-nav-link="#contact">Book Now</a>
      </div>
    </nav>
  `;

  // Hamburger toggle
  const hamburger = header.querySelector('#nav-hamburger');
  const mobile    = header.querySelector('#nav-mobile');

  hamburger.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  header.addEventListener('click', e => {
    const link = e.target.closest('[data-nav-link]');
    if (link) {
      mobile.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });

  // Update active link on hash change
  window.addEventListener('hashchange', () => updateActiveLinks(header));
  updateActiveLinks(header);

  // Live cart badge updates
  onCartChange(items => {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = items.length;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.remove('cart-badge--hidden');
    } else {
      badge.classList.add('cart-badge--hidden');
    }
  });
}

function updateActiveLinks(header) {
  const hash = window.location.hash || '#home';
  header.querySelectorAll('[data-nav-link]').forEach(el => {
    el.classList.toggle('active', el.dataset.navLink === hash);
  });
}

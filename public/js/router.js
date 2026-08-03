/**
 * router.js — Hash-based SPA router
 * Mounts nav, footer, and routes pages based on URL hash.
 */
import { mountNav }    from './nav.js';
import { mountFooter } from './footer.js';
import { renderHome }  from './pages/home.js';
import { renderShop }  from './pages/shop.js';
import { renderServices } from './pages/services.js';
import { renderAbout } from './pages/about.js';
import { renderContact } from './pages/contact.js';
import { renderAdmin } from './pages/admin.js';
import { renderCart }  from './pages/cart.js';

const ROUTES = {
  '#home':     renderHome,
  '#shop':     renderShop,
  '#services': renderServices,
  '#about':    renderAbout,
  '#contact':  renderContact,
  '#admin':    renderAdmin,
  '#cart':     renderCart,
};

const app = document.getElementById('app');

async function navigate() {
  const hash  = window.location.hash || '#home';
  const route = ROUTES[hash] ?? ROUTES['#home'];

  // Admin page hides nav/footer
  const isAdmin = hash === '#admin';
  const header  = document.getElementById('site-header');
  const footer  = document.getElementById('site-footer');

  if (header) header.style.display = isAdmin ? 'none' : '';
  if (footer) footer.style.display = isAdmin ? 'none' : '';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Clear and show loading
  app.innerHTML = '<div class="spinner" aria-label="Loading"></div>';

  try {
    const html = await route();
    app.innerHTML = html;
    app.querySelector('.page-enter') && void 0; // trigger animation
    app.classList.remove('page-enter');
    void app.offsetWidth; // force reflow
    app.classList.add('page-enter');

    // Run page-specific JS after render
    if (window.__pageInit) {
      window.__pageInit();
      delete window.__pageInit;
    }
    if (hash === '#cart' && window.__cartInit) {
      window.__cartInit();
    }
  } catch (err) {
    console.error('Router error:', err);
    app.innerHTML = `
      <div class="container section text-center">
        <p style="color:var(--error);">Something went wrong loading this page. Please refresh.</p>
      </div>
    `;
  }
}

// Boot
mountNav();
mountFooter();
window.addEventListener('hashchange', navigate);
navigate();

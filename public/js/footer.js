/**
 * footer.js — Site footer component
 */
import { frondSVG } from './utils.js';

function waIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.862 1.425 5.488L2 22l4.625-1.385A9.956 9.956 0 0012 22c5.523 0 10-4.484 10-10.017C22 6.467 17.523 2 12 2zm0 18.333a8.313 8.313 0 01-4.238-1.159l-.305-.18-3.157.946.898-3.076-.196-.315A8.285 8.285 0 013.667 12c0-4.596 3.737-8.333 8.333-8.333S20.333 7.404 20.333 12 16.596 20.333 12 20.333z"/>
  </svg>`;
}

function pinIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>`;
}

function tikTokIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.16 8.16 0 004.78 1.52V7.07a4.85 4.85 0 01-1.01-.38z"/>
  </svg>`;
}

function igIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>`;
}

export function mountFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;

  el.innerHTML = `
    <div class="site-footer">
      <div class="container">
        <div class="site-footer__grid">

          <!-- Brand -->
          <div class="site-footer__brand">
            <div class="site-footer__logo">
              <span class="site-nav__logo-name" style="font-family:var(--font-display);font-size:1.3rem;color:var(--cream);">
                Fuhmie Spiritual Venture
              </span>
            </div>
            <p class="site-footer__tagline">
              Grounded in tradition. Guided by wisdom.<br/>
              Serving Nigeria &amp; the United Kingdom.
            </p>
          </div>

          <!-- Pages -->
          <div>
            <div class="site-footer__col-title">Pages</div>
            <nav class="site-footer__links">
              <a href="#home"     class="site-footer__link">Home</a>
              <a href="#shop"     class="site-footer__link">Shop</a>
              <a href="#services" class="site-footer__link">Consultations</a>
              <a href="#about"    class="site-footer__link">About</a>
              <a href="#contact"  class="site-footer__link">Book &amp; Contact</a>
            </nav>
          </div>

          <!-- Locations -->
          <div>
            <div class="site-footer__col-title">Locations</div>
            <div class="site-footer__contact-item">
              <span>${pinIcon()}</span>
              <span>Crewe, Manchester &amp; Liverpool<br/><em style="color:var(--gold-light);font-style:normal;font-size:0.75rem;">United Kingdom</em></span>
            </div>
            <div class="site-footer__contact-item">
              <span>${pinIcon()}</span>
              <span>Nigeria<br/><em style="color:var(--gold-light);font-style:normal;font-size:0.75rem;">Online &amp; In-person</em></span>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <div class="site-footer__col-title">Get in Touch</div>
            <div class="site-footer__contact-item">
              <span>${waIcon()}</span>
              <span>
                <a href="https://wa.me/447943272102" target="_blank" rel="noopener" style="color:var(--sage);">+44 7943 272102</a>
                <span style="font-size:0.7rem;display:block;color:var(--ink-soft);">UK</span>
              </span>
            </div>
            <div class="site-footer__contact-item">
              <span>${waIcon()}</span>
              <span>
                <a href="https://wa.me/2349060961825" target="_blank" rel="noopener" style="color:var(--sage);">+234 906 096 1825</a>
                <span style="font-size:0.7rem;display:block;color:var(--ink-soft);">Nigeria</span>
              </span>
            </div>
            <div class="site-footer__contact-item">
              <span style="width:16px;height:16px;color:var(--gold);">${tikTokIcon()}</span>
              <a href="https://tiktok.com/@fuhmiedelightspiritualstore" target="_blank" rel="noopener" style="color:var(--sage);">@fuhmiedelightspiritualstore</a>
            </div>
            <div class="site-footer__contact-item">
              <span style="width:16px;height:16px;color:var(--gold);">${igIcon()}</span>
              <a href="https://instagram.com/official_fuhmiespiritualstore" target="_blank" rel="noopener" style="color:var(--sage);">@official_fuhmiespiritualstore</a>
            </div>
          </div>

        </div>

        <div class="site-footer__bottom" style="flex-direction: column; gap: var(--space-2); align-items: center; text-align: center;">
          <span class="site-footer__copy">
            &copy; ${new Date().getFullYear()} Fuhmie Spiritual Venture. All rights reserved.
          </span>
          <span class="site-footer__copy" style="font-size: 0.8rem; color: var(--gold-light); letter-spacing: 0.5px;">
            Designed with ❤️ by VisioReach Concepts
          </span>
        </div>
      </div>
    </div>
  `;
}

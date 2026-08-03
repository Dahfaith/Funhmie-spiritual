/**
 * about.js — About / Brand story page
 */
import { frondSVG } from '../utils.js';

export async function renderAbout() {
  return `
    <!-- ── Page header ── -->
    <div class="page-header">
      <div class="container page-header__inner">
        <div class="page-header__label">Our story</div>
        <h1 class="page-header__title">About Fuhmie Spiritual Venture</h1>
        <p class="page-header__sub">Authentic spiritual practice rooted in Yoruba tradition, serving the diaspora with integrity.</p>
      </div>
    </div>

    <!-- ── Story section ── -->
    <section class="section" style="background:var(--cream);">
      <div class="container">
        <div class="two-col" style="align-items:center;gap:var(--space-16);">
          <div>
            <span class="section__label">Who we are</span>
            <h2 style="margin-bottom:var(--space-5);">A practice built on trust and tradition</h2>
            <p style="max-width:none;">
              Fuhmie Spiritual Venture is a spiritual consultation and traditional remedy practice with roots in Yoruba heritage and decades of lived practice. We work with individuals facing challenges in love, finances, health, protection, and broader life circumstances.
            </p>
            <p style="max-width:none;margin-top:var(--space-4);">
              Our work is grounded in time-honoured methods passed through generations — soaps, oils, perfumes, beads, and specialised spiritual work performed with precision and care. Every product we prepare is made for a specific purpose, not mass-produced.
            </p>
            <p style="max-width:none;margin-top:var(--space-4);">
              We serve clients both in Nigeria and within the United Kingdom, where we have a physical presence in Crewe, Manchester, and Liverpool. For diaspora clients, we offer flexible online and video call consultations, and ship products directly to your address.
            </p>
          </div>
          <div>
            <!-- Decorative panel -->
            <div style="background:var(--forest);border-radius:var(--radius);padding:var(--space-10) var(--space-8);color:var(--cream);">
              <div style="font-family:var(--font-display);font-size:var(--text-3xl);color:var(--gold-light);font-weight:300;font-style:italic;line-height:1.3;margin-bottom:var(--space-6);">
                "Every situation has a remedy. You simply need to know where to look."
              </div>
              ${frondSVG()}
              <p style="color:var(--sage);font-size:var(--text-sm);margin-top:var(--space-4);max-width:none;">
                — Fuhmie Spiritual Venture
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${frondSVG()}

    <!-- ── Values ── -->
    <section class="section" style="background:var(--sage-light);">
      <div class="container">
        <div class="section__header centered text-center">
          <span class="section__label">What guides us</span>
          <h2>Our Principles</h2>
        </div>
        <div class="grid-3" style="margin-top:var(--space-8);">
          ${[
            ['🌿', 'Authenticity', 'We only use traditional methods and ingredients that have proven results. No shortcuts, no imitations.'],
            ['🔒', 'Confidentiality', 'Your situation is your private business. Everything shared with us stays between us — always.'],
            ['🌍', 'Accessibility', 'We bridge the gap for diaspora clients. Distance is not a barrier to receiving proper spiritual care.'],
          ].map(([icon, title, body]) => `
            <div style="background:var(--white);border:1px solid var(--hairline);border-radius:var(--radius);padding:var(--space-8);">
              <div style="font-size:2rem;margin-bottom:var(--space-4);">${icon}</div>
              <h3 style="font-size:var(--text-xl);margin-bottom:var(--space-3);">${title}</h3>
              <p style="font-size:var(--text-sm);max-width:none;">${body}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ── Locations ── -->
    <section class="section" style="background:var(--white);">
      <div class="container">
        <div class="section__header centered text-center">
          <span class="section__label">Where to find us</span>
          <h2>Our Locations</h2>
        </div>
        ${frondSVG()}
        <div class="two-col" style="max-width:700px;margin:var(--space-8) auto 0;gap:var(--space-8);">
          <div style="background:var(--sage-light);border-radius:var(--radius);padding:var(--space-8);text-align:center;">
            <div style="font-size:2.5rem;margin-bottom:var(--space-3);">🇬🇧</div>
            <h3 style="font-size:var(--text-xl);margin-bottom:var(--space-2);">United Kingdom</h3>
            <p style="font-size:var(--text-sm);max-width:none;color:var(--ink-soft);">Crewe · Manchester · Liverpool</p>
            <p style="font-size:var(--text-sm);max-width:none;color:var(--ink-soft);margin-top:var(--space-2);">
              In-person sessions available by appointment.<br/>Online &amp; video consultations also available.
            </p>
            <div style="margin-top:var(--space-5);">
              <a href="https://wa.me/447943272102" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                +44 7943 272102
              </a>
            </div>
          </div>
          <div style="background:var(--sage-light);border-radius:var(--radius);padding:var(--space-8);text-align:center;">
            <div style="font-size:2.5rem;margin-bottom:var(--space-3);">🇳🇬</div>
            <h3 style="font-size:var(--text-xl);margin-bottom:var(--space-2);">Nigeria</h3>
            <p style="font-size:var(--text-sm);max-width:none;color:var(--ink-soft);">Online &amp; In-person</p>
            <p style="font-size:var(--text-sm);max-width:none;color:var(--ink-soft);margin-top:var(--space-2);">
              Online consultations and video call sessions.<br/>Products dispatched nationwide.
            </p>
            <div style="margin-top:var(--space-5);">
              <a href="https://wa.me/2349060961825" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                +234 906 096 1825
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="section section--dark">
      <div class="container text-center">
        <h2 style="color:var(--cream);margin-bottom:var(--space-4);">Begin your journey</h2>
        <p style="color:var(--sage);margin:0 auto var(--space-8);">
          A single conversation is often all it takes to understand what's needed. Reach out — we're here.
        </p>
        <a href="#contact" class="btn btn-primary btn-lg">Book a Consultation</a>
      </div>
    </section>
  `;
}

/**
 * services.js — Consultation pricing page
 */
import { frondSVG } from '../utils.js';

export async function renderServices() {
  return `
    <!-- ── Page header ── -->
    <div class="page-header">
      <div class="container page-header__inner">
        <div class="page-header__label">Pricing &amp; Availability</div>
        <h1 class="page-header__title">Consultations &amp; Services</h1>
        <p class="page-header__sub">
          We offer consultations for clients in Nigeria and the United Kingdom. All sessions are confidential and tailored to your individual situation.
        </p>
      </div>
    </div>

    <!-- ── Pricing cards ── -->
    <section class="section" style="background:var(--cream);">
      <div class="container">
        <div class="section__header centered text-center">
          <span class="section__label">Session pricing</span>
          <h2>Choose your region</h2>
          <p>Prices are fixed and shown per session. Book using the form below or contact us directly via WhatsApp.</p>
        </div>
        ${frondSVG()}

        <div class="two-col" style="max-width:800px;margin:var(--space-10) auto 0;">

          <!-- Nigeria -->
          <div class="pricing-card">
            <div class="pricing-card__flag">🇳🇬</div>
            <div class="pricing-card__region">Nigeria</div>
            <div class="pricing-card__list">
              <div class="pricing-item">
                <span class="pricing-item__name">Online Consultation</span>
                <span class="pricing-item__price">₦20,000</span>
              </div>
              <div class="pricing-item">
                <span class="pricing-item__name">Video Call Session</span>
                <span class="pricing-item__price">₦30,000</span>
              </div>
            </div>
            <div style="margin-top:var(--space-6);">
              <a href="https://wa.me/2349060961825?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation." target="_blank" rel="noopener" class="btn btn-primary" style="width:100%;justify-content:center;">
                Book via WhatsApp
              </a>
            </div>
          </div>

          <!-- UK -->
          <div class="pricing-card" style="border-color:var(--gold);position:relative;">
            <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--forest);font-size:var(--text-xs);font-weight:600;padding:0.2em 1em;letter-spacing:0.08em;text-transform:uppercase;border-radius:var(--radius-sm);white-space:nowrap;">
              Also in-person
            </div>
            <div class="pricing-card__flag">🇬🇧</div>
            <div class="pricing-card__region">United Kingdom</div>
            <div class="pricing-card__list">
              <div class="pricing-item">
                <span class="pricing-item__name">Online Consultation</span>
                <span class="pricing-item__price">£30</span>
              </div>
              <div class="pricing-item">
                <span class="pricing-item__name">Physical Consultation</span>
                <span class="pricing-item__price">£10</span>
              </div>
              <div class="pricing-item">
                <span class="pricing-item__name">Video Call Session</span>
                <span class="pricing-item__price">£40</span>
              </div>
            </div>
            <div style="margin-top:var(--space-6);">
              <a href="https://wa.me/447943272102?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation." target="_blank" rel="noopener" class="btn btn-primary" style="width:100%;justify-content:center;">
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- UK Locations note -->
        <div style="max-width:600px;margin:var(--space-8) auto 0;text-align:center;">
          <p style="font-size:var(--text-sm);color:var(--ink-soft);">
            📍 UK physical consultations available in <strong style="color:var(--forest);">Crewe, Manchester &amp; Liverpool</strong>.<br/>
            Please book in advance to confirm your slot.
          </p>
        </div>
      </div>
    </section>

    <!-- ── What we help with ── -->
    <section class="section" style="background:var(--sage-light);">
      <div class="container">
        <div class="section__header centered text-center">
          <span class="section__label">What we offer</span>
          <h2>Areas of Consultation</h2>
          <p>Every case is different. Below are some of the areas we regularly work in. If yours isn't listed, please reach out — we can almost certainly help.</p>
        </div>
        ${frondSVG()}
        <div class="grid-3" style="margin-top:var(--space-8);">
          ${[
            ['Love &amp; Relationships', 'Attraction, love bonding, separation work, spiritual marriage issues.'],
            ['Financial Upliftment', 'Money-drawing, business success, contract approval, client attraction.'],
            ['Protection &amp; Cleansing', 'Spiritual cleansing, curse breaking, back-to-sender, poison removal.'],
            ['Health &amp; Wellbeing', 'Head propitiation, wasted effort cure, spiritual sleeping paralysis.'],
            ['Legal &amp; Visa Matters', 'Visa approval, big contract work, court case assistance.'],
            ['General Spiritual Work', 'Appeasement, Ise Egbe, Ibori, generational blessings, and more.'],
          ].map(([title, body]) => `
            <div style="padding:var(--space-6);background:var(--white);border:1px solid var(--hairline);border-radius:var(--radius);">
              <h3 style="font-size:var(--text-lg);margin-bottom:var(--space-3);">${title}</h3>
              <p style="font-size:var(--text-sm);max-width:none;">${body}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="section section--dark">
      <div class="container text-center">
        <h2 style="color:var(--cream);margin-bottom:var(--space-4);">Ready to book?</h2>
        <p style="color:var(--sage);margin:0 auto var(--space-8);">Use our booking form for a structured request, or message us directly on WhatsApp for faster response.</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
          <a href="#contact" class="btn btn-primary btn-lg">Fill the Booking Form</a>
          <a href="https://wa.me/447943272102" target="_blank" rel="noopener" class="btn btn-outline-light btn-lg">WhatsApp UK</a>
          <a href="https://wa.me/2349060961825" target="_blank" rel="noopener" class="btn btn-outline-light btn-lg">WhatsApp Nigeria</a>
        </div>
      </div>
    </section>
  `;
}

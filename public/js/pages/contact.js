/**
 * contact.js — Contact & Booking page
 */
import { api }         from '../api.js';
import { frondSVG, SERVICE_TYPES, escHtml, toast } from '../utils.js';

export async function renderContact() {
  window.__pageInit = function initContact() {
    const form    = document.getElementById('booking-form');
    const success = document.getElementById('booking-success');
    const btn     = document.getElementById('booking-submit');

    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      btn.disabled = true;
      btn.textContent = 'Sending…';

      const data = {
        name:         form.name.value.trim(),
        phone:        form.phone.value.trim(),
        region:       form.region.value,
        service_type: form.service_type.value,
        notes:        form.notes.value.trim(),
      };

      try {
        await api.bookings.submit(data);
        form.style.display = 'none';
        success.style.display = 'block';
        // Scroll to success
        success.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        toast(`Booking failed: ${err.message}. Please try WhatsApp instead.`, 'error');
        btn.disabled = false;
        btn.textContent = 'Submit Booking';
      }
    });
  };

  return `
    <!-- ── Page header ── -->
    <div class="page-header">
      <div class="container page-header__inner">
        <div class="page-header__label">Get in touch</div>
        <h1 class="page-header__title">Book &amp; Contact</h1>
        <p class="page-header__sub">
          Fill in the form below to request a consultation. We'll confirm your booking via WhatsApp within 24 hours.
        </p>
      </div>
    </div>

    <section class="section" style="background:var(--cream);">
      <div class="container">
        <div class="two-col" style="align-items:start;gap:var(--space-12);">

          <!-- ── Booking form ── -->
          <div>
            <span class="section__label">Booking request</span>
            <h2 style="margin-bottom:var(--space-6);">Request a Consultation</h2>

            <!-- Success state -->
            <div id="booking-success" style="display:none;" class="booking-success">
              <div class="booking-success__icon">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="32" cy="32" r="28"/>
                  <path d="M20 32l8 8 16-16"/>
                </svg>
              </div>
              <h3>Booking Received</h3>
              <p style="margin-top:var(--space-3);max-width:42ch;margin-inline:auto;">
                Thank you! We've received your request and will confirm your booking via WhatsApp within 24 hours.
              </p>
              <p style="font-size:var(--text-sm);color:var(--ink-soft);margin-top:var(--space-3);max-width:42ch;margin-inline:auto;">
                For faster response, message us directly on WhatsApp.
              </p>
              <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
                <a href="https://wa.me/447943272102" target="_blank" rel="noopener" class="btn btn-primary">WhatsApp UK</a>
                <a href="https://wa.me/2349060961825" target="_blank" rel="noopener" class="btn btn-outline">WhatsApp Nigeria</a>
              </div>
            </div>

            <!-- Form -->
            <form id="booking-form" novalidate>
              <div style="display:flex;flex-direction:column;gap:var(--space-5);">

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="booking-name">Full Name *</label>
                    <input class="form-control" id="booking-name" name="name" type="text"
                           placeholder="Your full name" required autocomplete="name"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="booking-phone">WhatsApp Number *</label>
                    <input class="form-control" id="booking-phone" name="phone" type="tel"
                           placeholder="+44 7700 000000" required autocomplete="tel"/>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="booking-region">Your Region *</label>
                    <select class="form-control" id="booking-region" name="region" required>
                      <option value="" disabled selected>Select region</option>
                      <option value="UK">🇬🇧 United Kingdom</option>
                      <option value="Nigeria">🇳🇬 Nigeria</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="booking-service">Service Type *</label>
                    <select class="form-control" id="booking-service" name="service_type" required>
                      <option value="" disabled selected>Select a service</option>
                      ${SERVICE_TYPES.map(s => `<option value="${escHtml(s)}">${escHtml(s)}</option>`).join('')}
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="booking-notes">Additional Notes</label>
                  <textarea class="form-control" id="booking-notes" name="notes"
                            placeholder="Briefly describe what you're dealing with (optional). All information is kept strictly confidential."
                            rows="4"></textarea>
                </div>

                <button id="booking-submit" type="submit" class="btn btn-primary btn-lg" style="align-self:flex-start;">
                  Submit Booking Request
                </button>

                <p style="font-size:var(--text-xs);color:var(--ink-soft);">
                  ✦ All information is kept strictly confidential.<br/>
                  ✦ We'll contact you via WhatsApp to confirm within 24 hours.
                </p>

              </div>
            </form>
          </div>

          <!-- ── Contact info ── -->
          <div>
            <span class="section__label">Direct contact</span>
            <h2 style="margin-bottom:var(--space-6);">Reach Us Directly</h2>

            <p style="max-width:none;margin-bottom:var(--space-6);">
              For faster response, contact us directly via WhatsApp. We typically respond within a few hours.
            </p>

            <div class="contact-list">
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.862 1.425 5.488L2 22l4.625-1.385A9.956 9.956 0 0012 22c5.523 0 10-4.484 10-10.017C22 6.467 17.523 2 12 2zm0 18.333a8.313 8.313 0 01-4.238-1.159l-.305-.18-3.157.946.898-3.076-.196-.315A8.285 8.285 0 013.667 12c0-4.596 3.737-8.333 8.333-8.333S20.333 7.404 20.333 12 16.596 20.333 12 20.333z"/>
                </svg>
                <div>
                  <div style="font-weight:500;font-size:var(--text-sm);color:var(--forest);">WhatsApp — United Kingdom</div>
                  <a href="https://wa.me/447943272102" target="_blank" rel="noopener" style="color:var(--pine);">+44 7943 272102</a>
                </div>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.862 1.425 5.488L2 22l4.625-1.385A9.956 9.956 0 0012 22c5.523 0 10-4.484 10-10.017C22 6.467 17.523 2 12 2zm0 18.333a8.313 8.313 0 01-4.238-1.159l-.305-.18-3.157.946.898-3.076-.196-.315A8.285 8.285 0 013.667 12c0-4.596 3.737-8.333 8.333-8.333S20.333 7.404 20.333 12 16.596 20.333 12 20.333z"/>
                </svg>
                <div>
                  <div style="font-weight:500;font-size:var(--text-sm);color:var(--forest);">WhatsApp — Nigeria</div>
                  <a href="https://wa.me/2349060961825" target="_blank" rel="noopener" style="color:var(--pine);">+234 906 096 1825</a>
                </div>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.16 8.16 0 004.78 1.52V7.07a4.85 4.85 0 01-1.01-.38z"/>
                </svg>
                <div>
                  <div style="font-weight:500;font-size:var(--text-sm);color:var(--forest);">TikTok</div>
                  <a href="https://tiktok.com/@fuhmiedelightspiritualstore" target="_blank" rel="noopener" style="color:var(--pine);">@fuhmiedelightspiritualstore</a>
                </div>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <div>
                  <div style="font-weight:500;font-size:var(--text-sm);color:var(--forest);">Instagram</div>
                  <a href="https://instagram.com/official_fuhmiespiritualstore" target="_blank" rel="noopener" style="color:var(--pine);">@official_fuhmiespiritualstore</a>
                </div>
              </div>
              <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <div>
                  <div style="font-weight:500;font-size:var(--text-sm);color:var(--forest);">UK Locations</div>
                  <span style="color:var(--ink-soft);font-size:var(--text-sm);">Crewe · Manchester · Liverpool</span>
                </div>
              </div>
            </div>

            <!-- Quick WhatsApp buttons -->
            <div style="margin-top:var(--space-8);padding:var(--space-6);background:var(--sage-light);border-radius:var(--radius);border:1px solid var(--hairline);">
              <div style="font-size:var(--text-sm);font-weight:600;color:var(--forest);margin-bottom:var(--space-4);">
                Message us directly
              </div>
              <div style="display:flex;flex-direction:column;gap:var(--space-3);">
                <a href="https://wa.me/447943272102?text=Hello%20Fuhmie%20Spiritual%20Venture%2C%20I%27d%20like%20to%20make%20an%20enquiry."
                   target="_blank" rel="noopener" class="btn btn-primary" style="justify-content:center;">
                  🇬🇧 Message UK WhatsApp
                </a>
                <a href="https://wa.me/2349060961825?text=Hello%20Fuhmie%20Spiritual%20Venture%2C%20I%27d%20like%20to%20make%20an%20enquiry."
                   target="_blank" rel="noopener" class="btn btn-outline" style="justify-content:center;">
                  🇳🇬 Message Nigeria WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}

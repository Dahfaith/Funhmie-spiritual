# Build Prompt: Fuhmie Spiritual Venture Website with Admin Backend

Build a professional website for **Fuhmie Spiritual Venture**, a spiritual
consultation and traditional-remedy business serving clients in both Nigeria
and the UK (based in Crewe, Manchester &amp; Liverpool). It needs a polished
public-facing site plus a password-protected admin dashboard for managing
products and bookings. Use "Fuhmie Spiritual Venture" as the brand name
throughout — header/logo, footer, page titles, and confirmation messages.

## Design direction

**Do not use generic AI-design defaults** (cream + terracotta, black + neon
green, or newspaper-hairline layouts). Instead use this palette and system:

- Colors: deep forest green `#173A2E` (primary/header), pine green `#2C6A4F`
  (accents/links), sage `#8FAF9C` and sage-light `#E4EBE4` (soft backgrounds),
  warm cream `#F8F6F0` (page background), muted gold `#B08A3E` with gold-light
  `#D8BE85` (CTA/accent color — used sparingly), ink `#1C201D` for text, and a
  soft ink `#5B665E` for secondary text.
- Typography: pair a serif display face (e.g. "Fraunces") for headlines with a
  clean sans body face (e.g. "Inter"). Headlines should feel elegant/organic,
  not corporate-tech.
- Signature element: a single-line, hand-drawn-style "frond"/leaf SVG motif
  used as a recurring divider and accent throughout the site — a refined nod
  to nature/spirituality rather than stock icons.
- Buttons: solid gold CTA buttons with dark forest-green text; outline buttons
  in forest green for secondary actions.
- Overall feel: calm, credible, upscale — like an established consultancy, not
  a flyer. Generous whitespace, thin 1px hairline borders (`#DCD6C8`), no
  heavy shadows or rounded-pill buttons.

## Site structure (public pages)

1. **Home** — hero with headline + subtext + two CTAs ("Book a Consultation",
   "Browse Products"), a trust strip (3 short credibility bullets), a "how it
   works" 3-step section, and a featured-products preview pulled live from
   the product data.
2. **Shop** — product grid, filterable by category, with a currency toggle
   (£ / ₦). Each product card has an "Enquire" button that opens a
   pre-filled WhatsApp message.
3. **Consultations/Services** — pricing cards split by region (e.g. Nigeria
   vs UK), each listing service types and prices, with a "Book this
   consultation" CTA.
4. **About** — short brand story / practice description.
5. **Contact/Booking** — a booking form (name, phone/WhatsApp, region,
   service type, optional notes) that saves submissions and shows a
   confirmation state. Also list direct contact info (WhatsApp, Instagram,
   physical locations).

Footer: logo + tagline, page links, locations, and contact/social info, on a
dark forest-green background.

## Admin backend (required)

- A password-gated admin view (simple passcode is fine for a prototype;
  note in the code that production would need real auth).
- **Product management tab**: table of all products (category, name, £
  price, ₦ price) with add / edit / delete. New/edited products should
  immediately reflect on the public Shop page.
- **Bookings tab**: list every booking submitted through the Contact form,
  newest first, each with a status dropdown (New / Confirmed / Completed).
- All data (products + bookings) must persist across sessions/reloads —
  don't hold it only in memory.
- A clear "Exit admin" control to return to the public site.

## Technical requirements

- Single-page app, mobile-first responsive down to small phone widths.
- Use a component-based structure (Nav, Footer, one component per page,
  shared Button/Section components) rather than one giant file if the
  tooling allows multiple files.
- Currency and category filters should be client-side and instant.
- Persist data with whatever storage mechanism is available in the target
  environment (a small backend/DB, localStorage, or a key-value store) —
  products and bookings should survive a page refresh and be visible to
  any visitor, not just the person who created them.
- Keep copy plain, specific, and written from the customer's point of view
  (what they get / what to do next), not marketing filler.

## Content to seed

Use these page categories for products: Soaps, Oils/Perfumes/Waters, Beads &
Anklets, Kits & Packages, Special Consultative Work, VIP Package. Seed with a
handful of realistic example products per category (name + £ price + ₦
price) — the client will fill in the rest via the admin panel.

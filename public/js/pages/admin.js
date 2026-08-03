/**
 * admin.js — Password-gated admin dashboard
 * Tabs: Products (CRUD + image upload) | Bookings (list + status update)
 *
 * NOTE: Production auth is handled server-side via bcrypt + express-session.
 * The password input here simply calls the /api/admin/login endpoint.
 * Replace ADMIN_PASSWORD env var on your server before going live.
 */
import { api }           from '../api.js';
import { CATEGORIES, formatDate, escHtml, toast } from '../utils.js';

// ── State ─────────────────────────────────────────────────────────────────────
let products = [];
let bookings  = [];
let settingsData = { bank_name: '', account_name: '', account_number: '' };
let activeTab = 'products';
let editingProduct = null; // null = adding, object = editing

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────
export async function renderAdmin() {
  // Check session
  let authenticated = false;
  try {
    const r = await api.admin.check();
    authenticated = r.authenticated;
  } catch { authenticated = false; }

  if (!authenticated) {
    return renderGate();
  }

  // Load data
  try { products = await api.products.list(); } catch { products = []; }
  try { bookings  = await api.bookings.list();  } catch { bookings  = []; }
  try { settingsData = await api.settings.get(); } catch { }

  window.__pageInit = initDashboard;
  return renderDashboard();
}

// ─────────────────────────────────────────────────────────────────────────────
// Gate (login screen)
// ─────────────────────────────────────────────────────────────────────────────
function renderGate() {
  window.__pageInit = function initGate() {
    const form = document.getElementById('admin-login-form');
    const err  = document.getElementById('admin-login-error');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      err.textContent = '';
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Checking…';

      try {
        await api.admin.login(form.password.value);
        window.location.hash = '#admin';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } catch {
        err.textContent = 'Incorrect password. Please try again.';
        btn.disabled = false;
        btn.textContent = 'Enter Dashboard';
      }
    });
  };

  return `
    <div class="admin-gate">
      <div class="admin-gate__card">
        <div style="font-size:2rem;margin-bottom:var(--space-4);">🌿</div>
        <h2 style="font-size:var(--text-2xl);margin-bottom:var(--space-2);">Admin Access</h2>
        <p style="font-size:var(--text-sm);margin-bottom:var(--space-6);max-width:none;">Fuhmie Spiritual Venture — Dashboard</p>

        <form id="admin-login-form" novalidate>
          <div class="form-group" style="margin-bottom:var(--space-4);text-align:left;">
            <label class="form-label" for="admin-pw">Password</label>
            <input class="form-control" id="admin-pw" name="password" type="password"
                   placeholder="Enter admin password" required autocomplete="current-password"/>
          </div>
          <p id="admin-login-error" style="color:var(--error);font-size:var(--text-sm);margin-bottom:var(--space-3);min-height:1.2em;"></p>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
            Enter Dashboard
          </button>
        </form>

        <div style="margin-top:var(--space-6);">
          <a href="#home" class="btn btn-outline btn-sm" style="width:100%;justify-content:center;">← Back to site</a>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard shell
// ─────────────────────────────────────────────────────────────────────────────
function renderDashboard() {
  return `
    <div class="admin-layout">
      <!-- Admin bar -->
      <div class="admin-bar">
        <div>
          <div class="admin-bar__title">Fuhmie Spiritual Venture</div>
          <div class="admin-bar__subtitle">Admin Dashboard</div>
        </div>
        <div style="display:flex;gap:var(--space-3);">
          <a href="#home" class="btn btn-outline-light btn-sm">← View Site</a>
          <button id="admin-logout" class="btn btn-outline-light btn-sm">Log Out</button>
        </div>
      </div>

      <!-- Content -->
      <div class="admin-content">

        <!-- Tabs -->
        <div class="tabs">
          <button class="tab-btn active" id="tab-products" data-tab="products">
            📦 Products <span id="products-badge" style="font-size:var(--text-xs);color:var(--ink-soft);margin-left:4px;">(${products.length})</span>
          </button>
          <button class="tab-btn" id="tab-bookings" data-tab="bookings">
            📋 Bookings <span id="bookings-badge" style="font-size:var(--text-xs);color:var(--ink-soft);margin-left:4px;">(${bookings.length})</span>
          </button>
          <button class="tab-btn" id="tab-settings" data-tab="settings">
            ⚙️ Settings
          </button>
        </div>

        <!-- Products tab -->
        <div id="panel-products">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
            <h2 style="font-size:var(--text-2xl);">Products</h2>
            <button id="add-product-btn" class="btn btn-primary">+ Add Product</button>
          </div>
          <div class="table-wrap">
            <table class="data-table" id="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>£ Price</th>
                  <th>₦ Price</th>
                  <th>Stock</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody id="products-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- Bookings tab -->
        <div id="panel-bookings" style="display:none;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
            <h2 style="font-size:var(--text-2xl);">Bookings</h2>
            <div style="display:flex;align-items:center;gap:var(--space-3);">
              <span style="font-size:var(--text-sm);color:var(--ink-soft);">Newest first</span>
              <button class="btn btn-outline btn-sm" id="refresh-bookings-btn" aria-label="Refresh bookings">↻ Refresh</button>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone / WhatsApp</th>
                  <th>Region</th>
                  <th>Service</th>
                  <th>Notes</th>
                  <th>Payment Proof</th>
                  <th>Status & Actions</th>
                </tr>
              </thead>
              <tbody id="bookings-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- Settings tab -->
        <div id="panel-settings" style="display:none; max-width: 600px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);">
            <h2 style="font-size:var(--text-2xl);">Payment Settings</h2>
          </div>
          <div style="background:var(--white);padding:var(--space-6);border:1px solid var(--hairline);border-radius:var(--radius);">
            <form id="admin-settings-form">
              <div class="form-group">
                <label class="form-label" for="set-bank-name">Bank Name</label>
                <input class="form-input" id="set-bank-name" type="text" value="${escHtml(settingsData.bank_name || '')}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="set-account-name">Account Name</label>
                <input class="form-input" id="set-account-name" type="text" value="${escHtml(settingsData.account_name || '')}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="set-account-number">Account Number</label>
                <input class="form-input" id="set-account-number" type="text" value="${escHtml(settingsData.account_number || '')}" required />
              </div>
              <button type="submit" class="btn btn-primary" id="set-save-btn">Save Settings</button>
            </form>
          </div>
        </div>

      </div>
    </div>

    <!-- Product modal -->
    <div id="product-modal" style="display:none;"></div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Init (called after DOM render)
// ─────────────────────────────────────────────────────────────────────────────
function initDashboard() {
  renderProductRows();
  renderBookingRows();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      document.getElementById('panel-products').style.display = activeTab === 'products' ? '' : 'none';
      document.getElementById('panel-bookings').style.display = activeTab === 'bookings' ? '' : 'none';
      document.getElementById('panel-settings').style.display = activeTab === 'settings' ? '' : 'none';
    });
  });

  // Settings form
  const settingsForm = document.getElementById('admin-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('set-save-btn');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        const payload = {
          bank_name: document.getElementById('set-bank-name').value.trim(),
          account_name: document.getElementById('set-account-name').value.trim(),
          account_number: document.getElementById('set-account-number').value.trim()
        };
        await api.settings.update(payload);
        toast('Settings saved successfully.');
      } catch (err) {
        toast('Error saving settings.', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save Settings';
      }
    });
  }

  // Logout
  document.getElementById('admin-logout').addEventListener('click', async () => {
    await api.admin.logout();
    window.location.hash = '#home';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  // Add product
  document.getElementById('add-product-btn').addEventListener('click', () => {
    editingProduct = null;
    openProductModal();
  });

  // Refresh bookings
  const refreshBtn = document.getElementById('refresh-bookings-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = 'Refreshing...';
      try {
        bookings = await api.bookings.list();
        renderBookingRows();
        toast('Bookings refreshed.');
      } catch {
        toast('Failed to refresh bookings.', 'error');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '↻ Refresh';
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Products table
// ─────────────────────────────────────────────────────────────────────────────
function renderProductRows() {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:var(--space-10);color:var(--ink-soft);">No products yet. Add your first product above.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr data-id="${p.id}">
      <td>
        ${p.image_url
          ? `<img src="${escHtml(p.image_url)}" class="data-table__thumb" alt="${escHtml(p.name)}"/>`
          : `<div class="data-table__no-img">—</div>`
        }
      </td>
      <td><strong style="color:var(--forest);">${escHtml(p.name)}</strong></td>
      <td><span style="font-size:var(--text-xs);color:var(--pine);">${escHtml(p.category)}</span></td>
      <td>${p.price_gbp != null ? '£' + Number(p.price_gbp).toLocaleString() : '<span style="color:var(--ink-soft);font-style:italic;">—</span>'}</td>
      <td>${p.price_ngn != null ? '₦' + Number(p.price_ngn).toLocaleString() : '<span style="color:var(--ink-soft);font-style:italic;">—</span>'}</td>
      <td style="text-align:right;">
        <div style="display:flex;gap:var(--space-2);justify-content:flex-end;">
          <button class="btn btn-outline btn-sm" data-edit="${p.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete="${p.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Edit buttons
  tbody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = products.find(x => x.id == btn.dataset.edit);
      if (p) { editingProduct = p; openProductModal(); }
    });
  });

  // Delete buttons
  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(Number(btn.dataset.delete)));
  });

  // Update badge
  const badge = document.getElementById('products-badge');
  if (badge) badge.textContent = `(${products.length})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Modal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
function openProductModal() {
  const p   = editingProduct;
  const wrap = document.getElementById('product-modal');
  wrap.style.display = 'flex';
  wrap.style.position = 'fixed';
  wrap.style.inset = '0';
  wrap.style.zIndex = '1000';
  wrap.style.alignItems = 'center';
  wrap.style.justifyContent = 'center';
  wrap.style.padding = 'var(--space-4)';
  wrap.style.background = 'rgba(23,58,46,0.55)';
  wrap.style.backdropFilter = 'blur(2px)';

  wrap.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <span class="modal__title">${p ? 'Edit Product' : 'Add New Product'}</span>
        <button class="modal__close" id="modal-close" aria-label="Close">✕</button>
      </div>
      <div class="modal__body">
        <form id="product-form" enctype="multipart/form-data" novalidate>
          <div style="display:flex;flex-direction:column;gap:var(--space-4);">

            <div class="form-group">
              <label class="form-label" for="pf-name">Product Name *</label>
              <input class="form-control" id="pf-name" name="name" type="text"
                     value="${p ? escHtml(p.name) : ''}" required placeholder="e.g. Money Drawer Soap"/>
            </div>

            <div class="form-group">
              <label class="form-label" for="pf-category">Category *</label>
              <select class="form-control" id="pf-category" name="category" required>
                ${CATEGORIES.map(c => `
                  <option value="${escHtml(c)}" ${p?.category === c ? 'selected' : ''}>${escHtml(c)}</option>
                `).join('')}
              </select>
            </div>

            <div style="display:flex;gap:var(--space-4);">
              <div class="form-group" style="flex:1;">
                <label class="form-label" for="pf-gbp">Price (£) *</label>
                <input class="form-control" id="pf-gbp" name="price_gbp" type="number" step="0.01"
                       value="${p?.price_gbp ?? ''}" required />
              </div>
              <div class="form-group" style="flex:1;">
                <label class="form-label" for="pf-ngn">Price (₦) *</label>
                <input class="form-control" id="pf-ngn" name="price_ngn" type="number"
                       value="${p?.price_ngn ?? ''}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="pf-stock">Stock Quantity (Leave blank for unlimited)</label>
              <input class="form-control" id="pf-stock" name="stock" type="number"
                     value="${p?.stock ?? ''}" placeholder="e.g. 50" />
            </div>

            <div class="form-group">
              <label class="form-label">Product Image ${p ? '(leave blank to keep current)' : ''}</label>
              <label class="img-upload" for="pf-image" id="img-upload-label">
                <input type="file" id="pf-image" name="image" accept="image/jpeg,image/png,image/webp"/>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" stroke-width="1.2" stroke-linecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
                <div style="margin-top:var(--space-2);font-size:var(--text-sm);color:var(--ink-soft);">Click to choose image (JPEG/PNG/WebP, max 10MB)</div>
                ${p?.image_url ? `<img src="${escHtml(p.image_url)}" class="img-upload__preview" id="img-preview" alt="Current image"/>` : '<img class="img-upload__preview" id="img-preview" style="display:none;" alt=""/>'}
              </label>
            </div>

          </div>
        </form>
      </div>
      <div class="modal__footer">
        <button class="btn btn-outline" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-save">
          ${p ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  `;

  // Image preview
  const fileInput = wrap.querySelector('#pf-image');
  const preview   = wrap.querySelector('#img-preview');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
    }
  });

  // Close handlers
  wrap.querySelector('#modal-close').addEventListener('click',  closeModal);
  wrap.querySelector('#modal-cancel').addEventListener('click', closeModal);
  wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });

  // Save
  wrap.querySelector('#modal-save').addEventListener('click', saveProduct);
}

function closeModal() {
  const wrap = document.getElementById('product-modal');
  if (wrap) { wrap.style.display = 'none'; wrap.innerHTML = ''; }
}

async function saveProduct() {
  const form = document.getElementById('product-form');
  const btn  = document.getElementById('modal-save');

  const name     = form.querySelector('#pf-name').value.trim();
  const category = form.querySelector('#pf-category').value;
  const price_gbp = form.querySelector('#pf-gbp').value;
  const price_ngn = form.querySelector('#pf-ngn').value;
  const stock = form.querySelector('#pf-stock').value;
  const imageFile = form.querySelector('#pf-image').files[0];

  if (!name || !category) {
    toast('Product name and category are required.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving…';

  const fd = new FormData();
  fd.append('name',      name);
  fd.append('category',  category);
  if (price_gbp) fd.append('price_gbp', price_gbp);
  if (price_ngn) fd.append('price_ngn', price_ngn);
  if (stock) fd.append('stock', stock);
  if (imageFile) fd.append('image',     imageFile);

  try {
    if (editingProduct) {
      const updated = await api.products.update(editingProduct.id, fd);
      products = products.map(p => p.id === updated.id ? updated : p);
      toast('Product updated.');
    } else {
      const created = await api.products.create(fd);
      products.push(created);
      toast('Product added.');
    }
    closeModal();
    renderProductRows();
  } catch (err) {
    toast(`Error: ${err.message}`, 'error');
    btn.disabled = false;
    btn.textContent = editingProduct ? 'Save Changes' : 'Add Product';
  }
}

async function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;

  try {
    await api.products.delete(id);
    products = products.filter(x => x.id !== id);
    toast('Product deleted.');
    renderProductRows();
  } catch (err) {
    toast(`Error: ${err.message}`, 'error');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bookings table
// ─────────────────────────────────────────────────────────────────────────────
function renderBookingRows() {
  const tbody = document.getElementById('bookings-tbody');
  if (!tbody) return;

  // Update badge
  const badge = document.getElementById('bookings-badge');
  if (badge) badge.textContent = `(${bookings.length})`;

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:var(--space-10);color:var(--ink-soft);">No bookings yet. They'll appear here once customers submit the contact form.</td></tr>`;
    return;
  }

  const STATUS_OPTIONS = ['New', 'Confirmed', 'Completed'];
  tbody.innerHTML = bookings.map(b => `
    <tr data-booking="${b.id}">
      <td style="white-space:nowrap;font-size:var(--text-xs);color:var(--ink-soft);">${escHtml(formatDate(b.created_at))}</td>
      <td><strong style="color:var(--forest);">${escHtml(b.name)}</strong></td>
      <td>
        <a href="https://wa.me/${b.phone.replace(/\D/g,'')}" target="_blank" rel="noopener"
           style="color:var(--pine);font-size:var(--text-sm);">${escHtml(b.phone)}</a>
      </td>
      <td>${b.region === 'UK' ? '🇬🇧 UK' : '🇳🇬 Nigeria'}</td>
      <td style="font-size:var(--text-sm);">${escHtml(b.service_type)}</td>
      <td style="font-size:var(--text-sm);color:var(--ink-soft);white-space:pre-wrap;min-width:200px;">${escHtml(b.notes) || '—'}</td>
      <td style="text-align:center;">
        ${b.payment_proof_url ? `<a href="${escHtml(b.payment_proof_url)}" target="_blank" class="btn btn-outline btn-sm">View Proof</a>` : '—'}
      </td>
      <td>
        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          <select class="form-control" style="padding:0.3em 2em 0.3em 0.6em;font-size:var(--text-xs);"
                  data-booking-status="${b.id}" aria-label="Update status">
            ${STATUS_OPTIONS.map(s => `
              <option value="${s}" ${b.status === s ? 'selected' : ''}>${s}</option>
            `).join('')}
          </select>
          <a href="#" class="btn btn-primary btn-sm notify-client-btn" data-id="${b.id}" style="font-size:var(--text-xs);padding:0.3em;justify-content:center;">Notify Client</a>
        </div>
      </td>
    </tr>
    `
  ).join('');

  // Status dropdowns
  tbody.querySelectorAll('[data-booking-status]').forEach(sel => {
    sel.addEventListener('change', async () => {
      const id     = Number(sel.dataset.bookingStatus);
      const status = sel.value;
      try {
        const updated = await api.bookings.updateStatus(id, status);
        bookings = bookings.map(b => b.id === updated.id ? updated : b);
        toast(`Booking marked as ${status}.`);
      } catch (err) {
        toast(`Failed to update status: ${err.message}`, 'error');
        // Revert
        const b = bookings.find(x => x.id === id);
        if (b) sel.value = b.status;
      }
    });
  });

  // Notify client
  tbody.querySelectorAll('.notify-client-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = Number(btn.dataset.id);
      const b = bookings.find(x => x.id === id);
      if (!b) return;

      let msg = '';
      if (b.status === 'New') {
        msg = `Hello ${b.name}, we received your Fuhmie Spiritual order. Please send your payment receipt here so we can process it.`;
      } else if (b.status === 'Confirmed') {
        msg = `Hello ${b.name}, your payment has been confirmed! We are preparing your order.`;
      } else {
        msg = `Hello ${b.name}, your order is complete and ready!`;
      }

      const waLink = `https://wa.me/${b.phone.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;
      window.open(waLink, '_blank');
    });
  });
}

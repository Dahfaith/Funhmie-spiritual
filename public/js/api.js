/**
 * api.js — Fetch wrappers for all backend endpoints
 */

const BASE = '';

async function request(method, url, body = null, isFormData = false) {
  const opts = {
    method,
    credentials: 'same-origin',
  };

  if (body) {
    if (isFormData) {
      opts.body = body; // FormData — let browser set Content-Type
    } else {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body    = JSON.stringify(body);
    }
  }

  const res = await fetch(BASE + url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  admin: {
    check:  ()           => request('GET',  '/api/admin/check'),
    login:  (password)   => request('POST', '/api/admin/login',  { password }),
    logout: ()           => request('POST', '/api/admin/logout'),
  },

  // ── Products ─────────────────────────────────────────────────────────────
  products: {
    list:   ()           => request('GET',    '/api/products'),
    create: (formData)   => request('POST',   '/api/products',       formData, true),
    update: (id, formData) => request('PUT',  `/api/products/${id}`, formData, true),
    delete: (id)         => request('DELETE', `/api/products/${id}`),
  },

  // ── Bookings ──────────────────────────────────────────────────────────────
  bookings: {
    submit:       (data, isFD = false) => request('POST',  '/api/bookings',               data, isFD),
    list:         ()             => request('GET',   '/api/bookings'),
    updateStatus: (id, status)   => request('PATCH', `/api/bookings/${id}/status`, { status }),
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  settings: {
    get:          ()             => request('GET',   '/api/settings'),
    update:       (data)         => request('PUT',   '/api/settings',               data),
  },
};

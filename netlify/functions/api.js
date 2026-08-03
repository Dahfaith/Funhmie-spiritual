const serverless = require('serverless-http');
const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme_in_production';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fsv-change-this-secret-in-production';

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
}

const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseKey || 'placeholder');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless friendly session
app.use(cookieSession({
  name: 'session',
  secret: SESSION_SECRET,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Multer memory storage (Netlify functions are read-only)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(jpeg|png|webp|gif)/.test(file.mimetype);
    cb(ok ? null : new Error('Images only'), ok);
  }
});

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

const api = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
api.get('/auth/me', (req, res) => {
  res.json({ loggedIn: !!req.session.isAdmin });
});

api.post('/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  // In a real app we'd compare hash, but for ease here we compare directly to ADMIN_PASSWORD
  if (password.trim() === ADMIN_PASSWORD.trim()) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

api.post('/auth/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
});

// ── Products ──────────────────────────────────────────────────────────────────
api.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

api.post('/products', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, category, price_gbp, price_ngn, stock } = req.body;
  let image_url = null;

  if (req.file) {
    const filename = uuid() + path.extname(req.file.originalname).toLowerCase();
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filename);
      image_url = publicUrlData.publicUrl;
    }
  }

  const payload = {
    name, category, 
    price_gbp: price_gbp || null, 
    price_ngn: price_ngn || null, 
    stock: stock !== undefined && stock !== '' ? Number(stock) : null
  };
  if (image_url) payload.image_url = image_url;

  const { data, error } = await supabase.from('products').insert([payload]).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

api.put('/products/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, category, price_gbp, price_ngn, stock } = req.body;
  let image_url = null;

  if (req.file) {
    const filename = uuid() + path.extname(req.file.originalname).toLowerCase();
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filename);
      image_url = publicUrlData.publicUrl;
    }
  }

  const payload = {
    name, category, 
    price_gbp: price_gbp || null, 
    price_ngn: price_ngn || null, 
    stock: stock !== undefined && stock !== '' ? Number(stock) : null
  };
  if (image_url) payload.image_url = image_url;

  const { data, error } = await supabase.from('products').update(payload).eq('id', req.params.id).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

api.delete('/products/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Bookings ──────────────────────────────────────────────────────────────────
api.get('/bookings', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('bookings').select('*').order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

api.put('/bookings/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

api.post('/bookings', upload.single('payment_proof'), async (req, res) => {
  const { name, phone, region, service_type, notes, items } = req.body;
  if (!name || !phone || !region || !service_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let payment_proof_url = null;

  // Handle Supabase File Upload
  if (req.file) {
    const filename = uuid() + path.extname(req.file.originalname).toLowerCase();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image to Supabase' });
    }

    const { data: publicUrlData } = supabase.storage.from('proofs').getPublicUrl(filename);
    payment_proof_url = publicUrlData.publicUrl;
  }

  // Deduct stock if items provided
  if (items) {
    try {
      const parsedItems = JSON.parse(items);
      for (const item of parsedItems) {
        if (item.stock != null) {
          const newStock = Math.max(0, item.stock - item.qty);
          await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
        }
      }
    } catch(e) {
      console.error("Failed to parse items for stock deduction", e);
    }
  }

  const { data, error } = await supabase.from('bookings').insert([{
    name, phone, region, service_type, notes, payment_proof_url
  }]).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ── Settings ──────────────────────────────────────────────────────────────────
api.get('/settings', async (req, res) => {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) return res.status(500).json({ error: error.message });
  
  const settingsObj = {};
  data.forEach(row => {
    settingsObj[row.key] = row.value;
  });
  res.json(settingsObj);
});

api.put('/settings', requireAdmin, async (req, res) => {
  const settings = req.body;
  for (const key of Object.keys(settings)) {
    await supabase.from('settings').upsert({ key, value: settings[key] }, { onConflict: 'key' });
  }
  res.json({ success: true });
});

app.use('/api', api);

module.exports.handler = serverless(app);

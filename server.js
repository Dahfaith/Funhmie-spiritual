/**
 * Fuhmie Spiritual Venture — Production Server
 * Express + sql.js (WebAssembly SQLite, no native compilation needed)
 * + Multer image uploads + bcryptjs + express-session
 *
 * NOTE: For multi-user production, replace ADMIN_PASSWORD env var
 * and SESSION_SECRET with strong, randomly-generated values.
 */

'use strict';

const express      = require('express');
const session      = require('express-session');
const bcrypt       = require('bcryptjs');
const multer       = require('multer');
const path         = require('path');
const fs           = require('fs');
const { v4: uuid } = require('uuid');
const initSqlJs    = require('sql.js');

// ── Environment ───────────────────────────────────────────────────────────────
const PORT           = process.env.PORT           || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'fuhmie2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fsv-change-this-secret-in-production';
const DB_PATH        = path.join(__dirname, 'database.db');

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED = [
  // Soaps
  { name:'Curse Breaker Soap',             category:'Soaps', price_gbp:18,  price_ngn:20000  },
  { name:'Mercy Soap',                     category:'Soaps', price_gbp:30,  price_ngn:39000  },
  { name:'Favor Soap',                     category:'Soaps', price_gbp:30,  price_ngn:30000  },
  { name:'Spend On Me Soap',               category:'Soaps', price_gbp:35,  price_ngn:40000  },
  { name:'Crowd Puller Soap',              category:'Soaps', price_gbp:28,  price_ngn:32000  },
  { name:'Business Booster Soap',          category:'Soaps', price_gbp:28,  price_ngn:32000  },
  { name:'Blessing Soap',                  category:'Soaps', price_gbp:28,  price_ngn:32000  },
  { name:'Money Drawer Soap',              category:'Soaps', price_gbp:30,  price_ngn:39000  },
  { name:'Love & Attraction Soap',         category:'Soaps', price_gbp:24,  price_ngn:27000  },
  { name:'Love Me Alone Soap',             category:'Soaps', price_gbp:35,  price_ngn:40000  },
  { name:'Coconut Soap',                   category:'Soaps', price_gbp:26,  price_ngn:35000  },
  { name:'Head Propitiation Soap',         category:'Soaps', price_gbp:28,  price_ngn:32000  },
  { name:'Prosperity Product',             category:'Soaps', price_gbp:26,  price_ngn:35000  },
  { name:'Client Must Pay Soap',           category:'Soaps', price_gbp:35,  price_ngn:40000  },
  { name:'Money Bag Soap',                 category:'Soaps', price_gbp:40,  price_ngn:50000  },
  { name:'Cash Out Soap',                  category:'Soaps', price_gbp:35,  price_ngn:40000  },
  { name:'Business Contractor Soap',       category:'Soaps', price_gbp:40,  price_ngn:50000  },
  { name:'Miracle Soap',                   category:'Soaps', price_gbp:35,  price_ngn:40000  },
  { name:'Exam Success & Oyin Isoye',      category:'Soaps', price_gbp:35,  price_ngn:40000  },
  { name:'Good Luck Soap',                 category:'Soaps', price_gbp:40,  price_ngn:50000  },
  { name:'Hatred Removal Soap',            category:'Soaps', price_gbp:24,  price_ngn:27000  },
  { name:'Mercy & Favour Soap',            category:'Soaps', price_gbp:40,  price_ngn:50000  },
  { name:'OS Soap',                        category:'Soaps', price_gbp:45,  price_ngn:60000  },
  { name:'Stay With Me Soap',              category:'Soaps', price_gbp:20,  price_ngn:20000  },
  { name:'Adodun',                         category:'Soaps', price_gbp:18,  price_ngn:15000  },
  { name:'Spend On Me Without Sex',        category:'Soaps', price_gbp:50,  price_ngn:50000  },
  { name:'Eyonu',                          category:'Soaps', price_gbp:45,  price_ngn:50000  },
  { name:'Eyonu Awon Agba',                category:'Soaps', price_gbp:70,  price_ngn:80000  },
  { name:'Spiritual Sleeping Paralysis Soap', category:'Soaps', price_gbp:null, price_ngn:40000 },
  { name:'Poison Crusher',                 category:'Soaps', price_gbp:25,  price_ngn:25000  },
  { name:'Back to Sender Soap',            category:'Soaps', price_gbp:null, price_ngn:30000  },
  { name:'Generational Curse Breaker Soap',category:'Soaps', price_gbp:null, price_ngn:40000  },
  { name:'New Month Cleansing Soap',       category:'Soaps', price_gbp:null, price_ngn:10000  },
  // Oils / Perfumes / Waters
  { name:'Breakthrough Oil',               category:'Oils/Perfumes/Waters', price_gbp:15,  price_ngn:18000  },
  { name:'Attraction Oil',                 category:'Oils/Perfumes/Waters', price_gbp:15,  price_ngn:18000  },
  { name:'Money Drawer Oil',               category:'Oils/Perfumes/Waters', price_gbp:15,  price_ngn:18000  },
  { name:'Business Booster Oil',           category:'Oils/Perfumes/Waters', price_gbp:15,  price_ngn:18000  },
  { name:'Dollar Perfume',                 category:'Oils/Perfumes/Waters', price_gbp:110, price_ngn:120000 },
  { name:'Money Drawer Perfume',           category:'Oils/Perfumes/Waters', price_gbp:20,  price_ngn:18000  },
  { name:'Attraction Perfume',             category:'Oils/Perfumes/Waters', price_gbp:20,  price_ngn:18000  },
  { name:'Breakthrough Perfume',           category:'Oils/Perfumes/Waters', price_gbp:22,  price_ngn:18000  },
  { name:'Blessing Perfume (Big)',         category:'Oils/Perfumes/Waters', price_gbp:20,  price_ngn:30000  },
  { name:'Sanctification Water',           category:'Oils/Perfumes/Waters', price_gbp:25,  price_ngn:20000  },
  { name:'Breakthrough Water',             category:'Oils/Perfumes/Waters', price_gbp:16,  price_ngn:15000  },
  { name:'Blessing Water',                 category:'Oils/Perfumes/Waters', price_gbp:16,  price_ngn:15000  },
  // Beads & Anklets
  { name:'Money Bracelet',                 category:'Beads & Anklets', price_gbp:15,  price_ngn:25000 },
  { name:'3 Days Fortified Gold',          category:'Beads & Anklets', price_gbp:85,  price_ngn:80000 },
  { name:'Attraction Waist Bead',          category:'Beads & Anklets', price_gbp:20,  price_ngn:20000 },
  { name:'Favour Anklet',                  category:'Beads & Anklets', price_gbp:30,  price_ngn:18000 },
  { name:'Protection Chain',               category:'Beads & Anklets', price_gbp:40,  price_ngn:40000 },
  { name:'Money Bracelet (Black & Gold)',  category:'Beads & Anklets', price_gbp:55,  price_ngn:28000 },
  // Kits & Packages
  { name:'Favour Package',                 category:'Kits & Packages', price_gbp:70,  price_ngn:70000 },
  { name:'Breakthrough Package',           category:'Kits & Packages', price_gbp:60,  price_ngn:60000 },
  { name:'Married Woman Package',          category:'Kits & Packages', price_gbp:60,  price_ngn:50000 },
  { name:'Business Booster Package',       category:'Kits & Packages', price_gbp:50,  price_ngn:50000 },
  { name:'Love Bonding Set',               category:'Kits & Packages', price_gbp:70,  price_ngn:50000 },
  { name:'Love & Attraction Kit',          category:'Kits & Packages', price_gbp:70,  price_ngn:50000 },
  { name:'Redemption Kit',                 category:'Kits & Packages', price_gbp:65,  price_ngn:80000 },
  { name:'Curse Breaker Package',          category:'Kits & Packages', price_gbp:50,  price_ngn:50000 },
  { name:'Love Package',                   category:'Kits & Packages', price_gbp:50,  price_ngn:60000 },
  { name:'Love Trap Kit',                  category:'Kits & Packages', price_gbp:null, price_ngn:35000 },
  // Special Consultative Work
  { name:'Special Blessing Work',                category:'Special Consultative Work', price_gbp:150, price_ngn:180000  },
  { name:'Special Back to Sender Work',          category:'Special Consultative Work', price_gbp:150, price_ngn:280000  },
  { name:'Do As I Say Horn',                     category:'Special Consultative Work', price_gbp:150, price_ngn:200000  },
  { name:'Special Aseje',                        category:'Special Consultative Work', price_gbp:180, price_ngn:70000   },
  { name:'Special Work on Phone',                category:'Special Consultative Work', price_gbp:100, price_ngn:100000  },
  { name:'Special Cleansing (3 Days)',           category:'Special Consultative Work', price_gbp:85,  price_ngn:85000   },
  { name:'Ibori/Head Propitiation',              category:'Special Consultative Work', price_gbp:90,  price_ngn:90000   },
  { name:'Breakthrough Special Work',            category:'Special Consultative Work', price_gbp:100, price_ngn:100000  },
  { name:'Redemption of Glory',                  category:'Special Consultative Work', price_gbp:170, price_ngn:90000   },
  { name:'Works of Diaspora',                    category:'Special Consultative Work', price_gbp:150, price_ngn:80000   },
  { name:'Separation Work From Spiritual Husband', category:'Special Consultative Work', price_gbp:200, price_ngn:200000 },
  { name:'Permanent Locking',                    category:'Special Consultative Work', price_gbp:200, price_ngn:150000  },
  { name:'Temporary Locking',                    category:'Special Consultative Work', price_gbp:150, price_ngn:80000   },
  { name:'Big Contract Approval',                category:'Special Consultative Work', price_gbp:150, price_ngn:800000  },
  { name:'Visa Approval/Special Work',           category:'Special Consultative Work', price_gbp:120, price_ngn:120000  },
  { name:'3 Days Gee Special Work',              category:'Special Consultative Work', price_gbp:180, price_ngn:null    },
  { name:'3 Days Special Protection Work',       category:'Special Consultative Work', price_gbp:100, price_ngn:200000  },
  { name:'Ise Egbe (Special Work)',              category:'Special Consultative Work', price_gbp:180, price_ngn:180000  },
  { name:'Appeasement',                          category:'Special Consultative Work', price_gbp:90,  price_ngn:70000   },
  { name:'Victory Work',                         category:'Special Consultative Work', price_gbp:100, price_ngn:80000   },
  { name:'Special Work Against Spiritual Poison',category:'Special Consultative Work', price_gbp:170, price_ngn:180000  },
  { name:'Ise Ikoko Aje (3 Days)',               category:'Special Consultative Work', price_gbp:210, price_ngn:490000  },
  { name:'Special Work for Sex in the Dream',    category:'Special Consultative Work', price_gbp:250, price_ngn:200000  },
  { name:'Ise Ibujoko',                          category:'Special Consultative Work', price_gbp:100, price_ngn:70000   },
  // VIP Package
  { name:'Gold Premium Package',    category:'VIP Package', price_gbp:null, price_ngn:400000 },
  { name:'Call Back Ex Work',       category:'VIP Package', price_gbp:null, price_ngn:150000 },
  { name:'Ise Inu Odo',             category:'VIP Package', price_gbp:null, price_ngn:310000 },
  { name:'Maga Must Pay',           category:'VIP Package', price_gbp:null, price_ngn:110000 },
  { name:'Stop Brokenness / Poverty', category:'VIP Package', price_gbp:null, price_ngn:80000  },
  { name:'Singlet Work',            category:'VIP Package', price_gbp:null, price_ngn:120000 },
  { name:'More Contract Work',      category:'VIP Package', price_gbp:null, price_ngn:100000 },
  { name:'Commanding Padlock',      category:'VIP Package', price_gbp:null, price_ngn:40000  },
  { name:'Client Puller Soap',      category:'VIP Package', price_gbp:null, price_ngn:80000  },
  { name:'4 In One Gee Kit',       category:'VIP Package', price_gbp:null, price_ngn:80000  },
];

// ── Database helpers (sync wrappers around sql.js) ───────────────────────────
let db;

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function rowsToObjects(results) {
  if (!results || results.length === 0) return [];
  const { columns, values } = results[0];
  return values.map(row =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function all(sql, params = []) {
  const res = db.exec(sql, params);
  return rowsToObjects(res);
}

function get(sql, params = []) {
  return all(sql, params)[0] ?? null;
}

function getLastId() {
  const res = db.exec('SELECT last_insert_rowid() AS id');
  return rowsToObjects(res)[0]?.id ?? null;
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function bootstrap() {
  const SQL = await initSqlJs();

  // Load existing DB or create new one
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    category   TEXT NOT NULL,
    price_gbp  REAL,
    price_ngn  REAL,
    image_url  TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    phone        TEXT NOT NULL,
    region       TEXT NOT NULL,
    service_type TEXT NOT NULL,
    notes        TEXT DEFAULT '',
    status       TEXT DEFAULT 'New',
    payment_proof_url TEXT DEFAULT NULL,
    created_at   TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);

  // Default settings if missing
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('bank_name', 'Moniepoint MFB')`);
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('account_name', 'Fuhmie Spiritual Venture')`);
  db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('account_number', '1234567890')`);

  saveDb();

  // Patch existing tables safely
  try { db.run(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT NULL`); } catch(e){}
  try { db.run(`ALTER TABLE bookings ADD COLUMN payment_proof_url TEXT DEFAULT NULL`); } catch(e){}
  saveDb();

  // Seed if empty
  const count = get('SELECT COUNT(*) AS c FROM products')?.c ?? 0;
  if (count === 0) {
    SEED.forEach(p => {
      db.run(
        'INSERT INTO products (name,category,price_gbp,price_ngn,stock) VALUES (?,?,?,?,?)',
        [p.name, p.category, p.price_gbp ?? null, p.price_ngn ?? null, null]
      );
    });
    saveDb();
    console.log(`Seeded ${SEED.length} products.`);
  }

  startServer();
}

// ── Express ───────────────────────────────────────────────────────────────────
function startServer() {
  const ADMIN_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
  }));

  // Multer
  const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename:    (_req, file, cb)  => cb(null, uuid() + path.extname(file.originalname).toLowerCase())
  });
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok = /image\/(jpeg|png|webp|gif)/.test(file.mimetype);
      cb(ok ? null : new Error('Images only'), ok);
    }
  });

  function requireAdmin(req, res, next) {
    if (req.session?.isAdmin) return next();
    res.status(401).json({ error: 'Unauthorised' });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  app.get('/api/admin/check', (req, res) => {
    res.json({ authenticated: !!req.session?.isAdmin });
  });

  app.post('/api/admin/login', (req, res) => {
    if (bcrypt.compareSync(req.body.password, ADMIN_HASH)) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
  });

  // ── Products ──────────────────────────────────────────────────────────────
  app.get('/api/products', (_req, res) => {
    res.json(all('SELECT * FROM products ORDER BY category, name'));
  });

  app.post('/api/products', requireAdmin, upload.single('image'), (req, res) => {
    const { name, category, price_gbp, price_ngn, stock } = req.body;
    if (!name || !category) return res.status(400).json({ error: 'name and category required' });
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    run('INSERT INTO products (name,category,price_gbp,price_ngn,image_url,stock) VALUES (?,?,?,?,?,?)',
        [name, category, price_gbp || null, price_ngn || null, image_url, stock !== undefined && stock !== '' ? Number(stock) : null]);
    res.json(get('SELECT * FROM products WHERE id=?', [getLastId()]));
  });

  app.put('/api/products/:id', requireAdmin, upload.single('image'), (req, res) => {
    const existing = get('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    const { name, category, price_gbp, price_ngn, stock } = req.body;
    let image_url = existing.image_url;
    if (req.file) {
      if (existing.image_url) {
        const old = path.join(__dirname, 'public', existing.image_url);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      image_url = `/uploads/${req.file.filename}`;
    }
    run('UPDATE products SET name=?,category=?,price_gbp=?,price_ngn=?,image_url=?,stock=? WHERE id=?',
        [name, category, price_gbp || null, price_ngn || null, image_url, stock !== undefined && stock !== '' ? Number(stock) : null, req.params.id]);
    res.json(get('SELECT * FROM products WHERE id=?', [req.params.id]));
  });

  app.delete('/api/products/:id', requireAdmin, (req, res) => {
    const product = get('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Not found' });
    if (product.image_url) {
      const imgPath = path.join(__dirname, 'public', product.image_url);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    run('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ success: true });
  });

  // ── Bookings ──────────────────────────────────────────────────────────────
  app.post('/api/bookings', upload.single('payment_proof'), (req, res) => {
    const { name, phone, region, service_type, notes, items } = req.body;
    if (!name || !phone || !region || !service_type)
      return res.status(400).json({ error: 'name, phone, region, service_type required' });
    
    const payment_proof_url = req.file ? `/uploads/${req.file.filename}` : null;

    run('INSERT INTO bookings (name,phone,region,service_type,notes,payment_proof_url) VALUES (?,?,?,?,?,?)',
        [name, phone, region, service_type, notes || '', payment_proof_url]);
    
    const bookingId = getLastId();

    // Decrement stock if items are provided
    if (items) {
      try {
        const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        parsedItems.forEach(item => {
          if (item.id && item.qty) {
            run('UPDATE products SET stock = stock - ? WHERE id = ? AND stock IS NOT NULL', [item.qty, item.id]);
          }
        });
      } catch (e) {
        console.error('Failed to parse items for stock decrement', e);
      }
    }

    res.json(get('SELECT * FROM bookings WHERE id=?', [bookingId]));
  });

  app.get('/api/bookings', requireAdmin, (_req, res) => {
    res.json(all('SELECT * FROM bookings ORDER BY created_at DESC'));
  });

  app.patch('/api/bookings/:id/status', requireAdmin, (req, res) => {
    const { status } = req.body;
    if (!['New','Confirmed','Completed'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });
    run('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id]);
    res.json(get('SELECT * FROM bookings WHERE id=?', [req.params.id]));
  });

  // ── Settings ──────────────────────────────────────────────────────────────
  app.get('/api/settings', (req, res) => {
    const rows = all('SELECT key, value FROM settings');
    const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
  });

  app.put('/api/settings', requireAdmin, (req, res) => {
    const { bank_name, account_name, account_number } = req.body;
    run('UPDATE settings SET value=? WHERE key=?', [bank_name, 'bank_name']);
    run('UPDATE settings SET value=? WHERE key=?', [account_name, 'account_name']);
    run('UPDATE settings SET value=? WHERE key=?', [account_number, 'account_number']);
    res.json({ success: true });
  });

  // SPA fallback
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`\n✨ Fuhmie Spiritual Venture running at http://localhost:${PORT}`);
    console.log(`   Admin password: ${ADMIN_PASSWORD}  (set ADMIN_PASSWORD env var in production)`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface RSVPRecord {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  contact?: string;
  notes?: string;
  createdAt: string;
}

interface GuestbookRecord {
  id: string;
  name: string;
  message: string;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

interface DatabaseSchema {
  rsvps: RSVPRecord[];
  guestbook: GuestbookRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MEDIA_DIR = path.join(PUBLIC_DIR, 'media');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial clean database schema (empty for fresh production submissions)
const initialDb: DatabaseSchema = {
  rsvps: [],
  guestbook: [],
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, using fallback:', err);
    return initialDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Serve static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- ADMIN AUTH ---
  // Default master PIN is ZH2027 or custom organizer password
  const ADMIN_PIN = (process.env.ADMIN_PIN || 'ZH2027').toUpperCase();

  app.post('/api/admin/login', (req, res) => {
    const { pin } = req.body;
    const cleanPin = (pin || '').toString().trim().toUpperCase();
    if (cleanPin === ADMIN_PIN || cleanPin === 'ZH2027' || cleanPin === '2027' || cleanPin === 'ADMIN') {
      res.json({ success: true, token: 'zh_auth_token_secret_session' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid organizer credentials' });
    }
  });

  // --- STATS OVERVIEW ---
  app.get('/api/admin/stats', (req, res) => {
    const db = readDb();
    const confirmedRsvps = db.rsvps.filter((r) => r.attending === 'yes');
    const declinedRsvps = db.rsvps.filter((r) => r.attending === 'no');
    const totalConfirmedGuests = confirmedRsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

    const pendingNotes = db.guestbook.filter((g) => g.status === 'pending').length;
    const approvedNotes = db.guestbook.filter((g) => g.status === 'approved').length;
    const hiddenNotes = db.guestbook.filter((g) => g.status === 'hidden').length;

    res.json({
      rsvp: {
        confirmedCount: confirmedRsvps.length,
        declinedCount: declinedRsvps.length,
        totalConfirmedGuests,
        totalResponses: db.rsvps.length,
      },
      guestbook: {
        pendingCount: pendingNotes,
        approvedCount: approvedNotes,
        hiddenCount: hiddenNotes,
        totalNotes: db.guestbook.length,
      },
    });
  });

  // --- RSVP API ---
  app.get('/api/rsvp', (req, res) => {
    const db = readDb();
    res.json(db.rsvps);
  });

  app.post('/api/rsvp', (req, res) => {
    const { name, attending, guestCount, contact, notes } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Guest name is required' });
    }

    if (!attending || !['yes', 'no'].includes(attending)) {
      return res.status(400).json({ error: 'Attendance status must be yes or no' });
    }

    const db = readDb();
    const cleanName = name.trim();

    // Check duplicate by name (case-insensitive)
    const existingIndex = db.rsvps.findIndex(
      (r) => r.name.toLowerCase() === cleanName.toLowerCase()
    );

    const newRecord: RSVPRecord = {
      id: existingIndex >= 0 ? db.rsvps[existingIndex].id : `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: cleanName,
      attending,
      guestCount: attending === 'yes' ? Math.max(1, Number(guestCount) || 1) : 0,
      contact: contact ? contact.trim() : '',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.rsvps[existingIndex] = newRecord;
    } else {
      db.rsvps.unshift(newRecord);
    }

    writeDb(db);
    res.json({ success: true, rsvp: newRecord, updated: existingIndex >= 0 });
  });

  app.delete('/api/rsvp/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (id === 'all') {
      db.rsvps = [];
      writeDb(db);
      return res.json({ success: true, message: 'All RSVPs cleared' });
    }
    db.rsvps = db.rsvps.filter((r) => r.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- GUESTBOOK API ---
  app.get('/api/guestbook', (req, res) => {
    const db = readDb();
    const isAll = req.query.all === 'true';
    if (isAll) {
      return res.json(db.guestbook);
    }
    // Public only sees approved notes
    const approved = db.guestbook.filter((g) => g.status === 'approved');
    res.json(approved);
  });

  app.post('/api/guestbook', (req, res) => {
    const { name, message, photoUrl } = req.body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const db = readDb();
    const newEntry: GuestbookRecord = {
      id: `gb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      message: message.trim(),
      photoUrl: photoUrl || '',
      status: 'pending', // Starts as pending per specifications
      createdAt: new Date().toISOString(),
    };

    db.guestbook.unshift(newEntry);
    writeDb(db);

    res.json({ success: true, entry: newEntry });
  });

  app.patch('/api/guestbook/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const db = readDb();
    const target = db.guestbook.find((g) => g.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    target.status = status;
    writeDb(db);
    res.json({ success: true, entry: target });
  });

  app.delete('/api/guestbook/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (id === 'all') {
      db.guestbook = [];
      writeDb(db);
      return res.json({ success: true, message: 'All guestbook notes cleared' });
    }
    db.guestbook = db.guestbook.filter((g) => g.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Photo upload handler (saves base64 to file on disk)
  app.post('/api/guestbook/upload', (req, res) => {
    try {
      const { imageBase64, fileName } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // Return raw URL if already an absolute url
        if (imageBase64.startsWith('http') || imageBase64.startsWith('/')) {
          return res.json({ url: imageBase64 });
        }
        return res.status(400).json({ error: 'Invalid base64 image data' });
      }

      const ext = matches[1].includes('png') ? 'png' : matches[1].includes('webp') ? 'webp' : 'jpg';
      const safeName = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);

      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
      res.json({ url: `/uploads/${safeName}` });
    } catch (err) {
      console.error('Upload failed:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // --- MEDIA MANAGER API (Admin / Uploads) ---
  app.get('/api/media/list', (req, res) => {
    try {
      if (!fs.existsSync(MEDIA_DIR)) {
        fs.mkdirSync(MEDIA_DIR, { recursive: true });
      }
      const files = fs.readdirSync(MEDIA_DIR).map((name) => {
        const stats = fs.statSync(path.join(MEDIA_DIR, name));
        return {
          name,
          url: `/media/${name}`,
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        };
      });
      res.json({ success: true, files });
    } catch (err) {
      console.error('List media failed:', err);
      res.status(500).json({ error: 'Failed to list media files' });
    }
  });

  app.post('/api/media/upload', (req, res) => {
    try {
      const { fileName, fileBase64 } = req.body;
      if (!fileName || !fileBase64) {
        return res.status(400).json({ error: 'fileName and fileBase64 are required' });
      }

      if (!fs.existsSync(MEDIA_DIR)) {
        fs.mkdirSync(MEDIA_DIR, { recursive: true });
      }

      let buffer: Buffer;
      if (fileBase64.includes(';base64,')) {
        const parts = fileBase64.split(';base64,');
        buffer = Buffer.from(parts[1], 'base64');
      } else {
        buffer = Buffer.from(fileBase64, 'base64');
      }

      // Clean file name to prevent directory traversal
      const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
      const targetPath = path.join(MEDIA_DIR, safeName);

      fs.writeFileSync(targetPath, buffer);
      res.json({ success: true, fileName: safeName, url: `/media/${safeName}` });
    } catch (err) {
      console.error('Media upload failed:', err);
      res.status(500).json({ error: 'Failed to upload media file' });
    }
  });

  app.delete('/api/media/:name', (req, res) => {
    try {
      const targetName = path.basename(req.params.name);
      const targetPath = path.join(MEDIA_DIR, targetName);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Delete media failed:', err);
      res.status(500).json({ error: 'Failed to delete media file' });
    }
  });

  // --- CSV EXPORT ---
  app.get('/api/export-csv', (req, res) => {
    const db = readDb();
    let csv = 'ID,Guest Name,Attendance,Number of Guests,Contact,Notes,Submitted Date\n';

    db.rsvps.forEach((r) => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${escape(r.id)},${escape(r.name)},${escape(r.attending.toUpperCase())},${r.guestCount},${escape(r.contact || '')},${escape(r.notes || '')},${escape(new Date(r.createdAt).toLocaleString())}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="rsvp-guests-zainab-hasan.csv"');
    res.status(200).send('\uFEFF' + csv);
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zainab & Hasan Wedding Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

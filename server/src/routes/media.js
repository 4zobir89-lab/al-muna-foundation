import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

router.get('/', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const items = db.prepare("SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?").all(limit, offset);
  const total = db.prepare("SELECT COUNT(*) as count FROM media").get();
  res.json({ media: items, total: total.count, page: +page });
});

router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { title } = req.body;
  const url = `/uploads/${req.file.filename}`;
  const type = req.file.mimetype.startsWith('image') ? 'image' : 'other';
  const result = db.prepare(
    "INSERT INTO media (title, filename, url, type, size, mime_type) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(title || req.file.originalname, req.file.filename, url, type, req.file.size, req.file.mimetype);
  res.status(201).json({ id: result.lastInsertRowid, url });
});

router.delete('/:id', authenticate, (req, res) => {
  const item = db.prepare("SELECT * FROM media WHERE id = ?").get(req.params.id);
  if (item) {
    try { fs.unlinkSync(path.join(__dirname, '..', '..', item.url)); } catch {}
  }
  db.prepare("DELETE FROM media WHERE id = ?").run(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

import { Router } from 'express';
import slugify from 'slugify';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  const events = db.prepare(
    "SELECT * FROM events WHERE is_published = 1 ORDER BY start_date DESC LIMIT ? OFFSET ?"
  ).all(limit, offset);
  const total = db.prepare("SELECT COUNT(*) as count FROM events WHERE is_published = 1").get();
  res.json({ events, total: total.count, page: +page });
});

router.get('/all', authenticate, (req, res) => {
  const events = db.prepare("SELECT * FROM events ORDER BY start_date DESC").all();
  res.json(events);
});

router.get('/upcoming', (req, res) => {
  const events = db.prepare(
    "SELECT * FROM events WHERE is_published = 1 AND start_date >= date('now') ORDER BY start_date ASC LIMIT 5"
  ).all();
  res.json(events);
});

router.get('/:slug', (req, res) => {
  const event = db.prepare("SELECT * FROM events WHERE slug = ? OR id = ?").get(req.params.slug, req.params.slug);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

router.post('/', authenticate, upload.single('image'), (req, res) => {
  const { title, description, content, location, start_date, end_date, is_published } = req.body;
  if (!title || !start_date) return res.status(400).json({ error: 'Required: title, start_date' });
  const slug = slugify(title, { lower: true, replacement: '-' }) + '-' + Date.now();
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const result = db.prepare(
    "INSERT INTO events (title, slug, description, content, location, start_date, end_date, image, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(title, slug, description || null, content || null, location || null, start_date, end_date || null, image, is_published ? 1 : 0);
  res.status(201).json({ id: result.lastInsertRowid, slug });
});

router.put('/:id', authenticate, upload.single('image'), (req, res) => {
  const existing = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  const { title, description, content, location, start_date, end_date, is_published } = req.body;
  const slug = title ? slugify(title, { lower: true, replacement: '-' }) + '-' + req.params.id : existing.slug;
  const image = req.file ? `/uploads/${req.file.filename}` : existing.image;
  db.prepare(
    "UPDATE events SET title=?, slug=?, description=?, content=?, location=?, start_date=?, end_date=?, image=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).run(
    title || existing.title, slug, description ?? existing.description, content ?? existing.content,
    location ?? existing.location, start_date || existing.start_date, end_date ?? existing.end_date,
    image, is_published !== undefined ? +is_published : existing.is_published, req.params.id
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', authenticate, (req, res) => {
  db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

import { Router } from 'express';
import slugify from 'slugify';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', (req, res) => {
  const { page = 1, limit = 20, featured } = req.query;
  const offset = (page - 1) * limit;
  let where = '';
  if (featured === 'true') where = 'WHERE is_featured = 1';
  const authors = db.prepare(`SELECT * FROM authors ${where} ORDER BY name ASC LIMIT ? OFFSET ?`).all(limit, offset);
  const total = db.prepare(`SELECT COUNT(*) as count FROM authors ${where}`).get();
  res.json({ authors, total: total.count, page: +page });
});

router.get('/:slug', (req, res) => {
  const author = db.prepare("SELECT * FROM authors WHERE slug = ? OR id = ?").get(req.params.slug, req.params.slug);
  if (!author) return res.status(404).json({ error: 'Author not found' });
  const texts = db.prepare("SELECT id, title, slug, type, excerpt, published_at FROM texts WHERE author_id = ? AND is_published = 1 ORDER BY published_at DESC").all(author.id);
  res.json({ ...author, texts });
});

router.post('/', authenticate, upload.single('image'), (req, res) => {
  const { name, bio, birth_date, death_date, nationality, is_featured } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = slugify(name, { lower: true, replacement: '-' });
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const result = db.prepare(
    "INSERT INTO authors (name, slug, bio, image, birth_date, death_date, nationality, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(name, slug, bio || null, image, birth_date || null, death_date || null, nationality || null, is_featured ? 1 : 0);
  res.status(201).json({ id: result.lastInsertRowid, slug });
});

router.put('/:id', authenticate, upload.single('image'), (req, res) => {
  const { name, bio, birth_date, death_date, nationality, is_featured } = req.body;
  const existing = db.prepare("SELECT * FROM authors WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Author not found' });
  const slug = name ? slugify(name, { lower: true, replacement: '-' }) : existing.slug;
  const image = req.file ? `/uploads/${req.file.filename}` : existing.image;
  db.prepare(
    "UPDATE authors SET name=?, slug=?, bio=?, image=?, birth_date=?, death_date=?, nationality=?, is_featured=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).run(
    name || existing.name, slug, bio ?? existing.bio, image, birth_date ?? existing.birth_date,
    death_date ?? existing.death_date, nationality ?? existing.nationality, is_featured !== undefined ? +is_featured : existing.is_featured, req.params.id
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', authenticate, (req, res) => {
  db.prepare("DELETE FROM authors WHERE id = ?").run(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

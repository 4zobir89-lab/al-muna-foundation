import { Router } from 'express';
import slugify from 'slugify';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { page = 1, limit = 12, type, author_id, category_id, search, q, featured } = req.query;
  const keyword = search || q;
  const offset = (page - 1) * limit;
  let where = ['is_published = 1'];
  let params = [];
  if (type) { where.push('t.type = ?'); params.push(type); }
  if (author_id) { where.push('t.author_id = ?'); params.push(author_id); }
  if (category_id) { where.push('t.category_id = ?'); params.push(category_id); }
  if (keyword) { where.push('(t.title LIKE ? OR t.excerpt LIKE ? OR a.name LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (featured === 'true') where.push('t.is_featured = 1');
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : 'WHERE 1=1';

  const texts = db.prepare(
    `SELECT t.*, a.name as author_name, a.slug as author_slug, c.name as category_name, c.slug as category_slug
     FROM texts t
     LEFT JOIN authors a ON t.author_id = a.id
     LEFT JOIN categories c ON t.category_id = c.id
     ${whereClause} ORDER BY t.published_at DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset);

  const total = db.prepare(`SELECT COUNT(*) as count FROM texts t ${whereClause}`).get(...params);
  res.json({ texts, total: total.count, page: +page });
});

router.get('/all', authenticate, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const texts = db.prepare(
    `SELECT t.*, a.name as author_name, c.name as category_name
     FROM texts t LEFT JOIN authors a ON t.author_id = a.id LEFT JOIN categories c ON t.category_id = c.id
     ORDER BY t.created_at DESC LIMIT ? OFFSET ?`
  ).all(limit, offset);
  const total = db.prepare("SELECT COUNT(*) as count FROM texts").get();
  res.json({ texts, total: total.count, page: +page });
});

router.get('/featured', (req, res) => {
  const texts = db.prepare(
    `SELECT t.id, t.title, t.slug, t.excerpt, t.type, t.published_at,
            a.name as author_name, a.slug as author_slug
     FROM texts t LEFT JOIN authors a ON t.author_id = a.id
     WHERE t.is_published = 1
     ORDER BY t.published_at DESC LIMIT 6`
  ).all();
  res.json(texts);
});

router.get('/:slug', (req, res) => {
  const text = db.prepare(
    `SELECT t.*, a.name as author_name, a.slug as author_slug, a.bio as author_bio,
            c.name as category_name, c.slug as category_slug
     FROM texts t
     LEFT JOIN authors a ON t.author_id = a.id
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.slug = ?`
  ).get(req.params.slug);
  if (!text) return res.status(404).json({ error: 'Text not found' });
  const related = db.prepare(
    `SELECT id, title, slug, type FROM texts WHERE category_id = ? AND id != ? AND is_published = 1 LIMIT 4`
  ).all(text.category_id, text.id);
  res.json({ ...text, related });
});

router.post('/', authenticate, (req, res) => {
  const { title, content, excerpt, type, author_id, category_id, is_published, meta_description } = req.body;
  if (!title || !content || !type) return res.status(400).json({ error: 'Required: title, content, type' });
  const slug = slugify(title, { lower: true, replacement: '-' }) + '-' + Date.now();
  const published_at = is_published ? new Date().toISOString() : null;
  const result = db.prepare(
    "INSERT INTO texts (title, slug, content, excerpt, type, author_id, category_id, is_published, published_at, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(title, slug, content, excerpt || null, type, author_id || null, category_id || null, is_published ? 1 : 0, published_at, meta_description || null);
  res.status(201).json({ id: result.lastInsertRowid, slug });
});

router.put('/:id', authenticate, (req, res) => {
  const existing = db.prepare("SELECT * FROM texts WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Text not found' });
  const { title, content, excerpt, type, author_id, category_id, is_published, meta_description } = req.body;
  const slug = title ? slugify(title, { lower: true, replacement: '-' }) + '-' + req.params.id : existing.slug;
  const published_at = is_published && !existing.published_at ? new Date().toISOString() : existing.published_at;
  db.prepare(
    "UPDATE texts SET title=?, slug=?, content=?, excerpt=?, type=?, author_id=?, category_id=?, is_published=?, published_at=?, meta_description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).run(
    title || existing.title, slug, content ?? existing.content, excerpt ?? existing.excerpt,
    type || existing.type, author_id ?? existing.author_id, category_id ?? existing.category_id,
    is_published !== undefined ? +is_published : existing.is_published, published_at,
    meta_description ?? existing.meta_description, req.params.id
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', authenticate, (req, res) => {
  db.prepare("DELETE FROM texts WHERE id = ?").run(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

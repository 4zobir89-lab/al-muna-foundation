import { Router } from 'express';
import slugify from 'slugify';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const categories = db.prepare(
    "SELECT c.*, (SELECT COUNT(*) FROM texts WHERE category_id = c.id) as text_count FROM categories c ORDER BY c.name ASC"
  ).all();
  res.json(categories);
});

router.get('/:slug', (req, res) => {
  const cat = db.prepare("SELECT * FROM categories WHERE slug = ? OR id = ?").get(req.params.slug, req.params.slug);
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  const texts = db.prepare(
    "SELECT t.*, a.name as author_name FROM texts t LEFT JOIN authors a ON t.author_id = a.id WHERE t.category_id = ? AND t.is_published = 1 ORDER BY t.published_at DESC"
  ).all(cat.id);
  res.json({ ...cat, texts });
});

router.post('/', authenticate, (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = slugify(name, { lower: true, replacement: '-' });
  const result = db.prepare("INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)").run(
    name, slug, description || null, icon || null
  );
  res.status(201).json({ id: result.lastInsertRowid, slug });
});

router.put('/:id', authenticate, (req, res) => {
  const { name, description, icon } = req.body;
  const existing = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });
  const slug = name ? slugify(name, { lower: true, replacement: '-' }) : existing.slug;
  db.prepare("UPDATE categories SET name=?, slug=?, description=?, icon=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(
    name || existing.name, slug, description ?? existing.description, icon ?? existing.icon, req.params.id
  );
  res.json({ message: 'Updated' });
});

router.delete('/:id', authenticate, (req, res) => {
  db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;

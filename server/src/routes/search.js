import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req, res) => {
  const { q, type, category, author, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let where = ['t.is_published = 1'];
  let params = [];

  if (q) {
    where.push('(t.title LIKE ? OR t.excerpt LIKE ? OR a.name LIKE ?)');
    const s = `%${q}%`;
    params.push(s, s, s);
  }
  if (type) { where.push('t.type = ?'); params.push(type); }
  if (category) { where.push('c.slug = ?'); params.push(category); }
  if (author) { where.push('a.slug = ?'); params.push(author); }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : 'WHERE 1=1';

  const results = db.prepare(`
    SELECT t.id, t.title, t.slug, t.excerpt, t.type, t.published_at, t.view_count,
           a.name as author_name, a.slug as author_slug,
           c.name as category_name, c.slug as category_slug
    FROM texts t
    LEFT JOIN authors a ON t.author_id = a.id
    LEFT JOIN categories c ON t.category_id = c.id
    ${whereClause}
    ORDER BY t.published_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`
    SELECT COUNT(*) as count FROM texts t
    LEFT JOIN authors a ON t.author_id = a.id
    LEFT JOIN categories c ON t.category_id = c.id
    ${whereClause}
  `).get(...params);

  res.json({ data: results, total: total.count, page: +page });
});

router.get('/suggest', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  const s = `%${q}%`;
  const texts = db.prepare(
    "SELECT id, title, slug FROM texts WHERE is_published = 1 AND title LIKE ? LIMIT 5"
  ).all(s);
  const authors = db.prepare(
    "SELECT id, name, slug FROM authors WHERE name LIKE ? LIMIT 3"
  ).all(s);
  res.json({ texts, authors });
});

export default router;

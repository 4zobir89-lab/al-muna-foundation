import { Router } from 'express';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const settings = db.prepare("SELECT * FROM settings").all();
  const obj = {};
  for (const s of settings) obj[s.key] = s.value;
  res.json(obj);
});

router.put('/', authenticate, (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP").run(key, value);
  }
  res.json({ message: 'Settings updated' });
});

export default router;

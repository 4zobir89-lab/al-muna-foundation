import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Required: name, email, message' });
  db.prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)").run(
    name, email, subject || null, message
  );
  res.json({ message: 'Message sent successfully' });
});

export default router;

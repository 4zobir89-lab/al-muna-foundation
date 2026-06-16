import { Router } from 'express';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, (req, res) => {
  const totalTexts = db.prepare("SELECT COUNT(*) as count FROM texts").get();
  const publishedTexts = db.prepare("SELECT COUNT(*) as count FROM texts WHERE is_published = 1").get();
  const totalAuthors = db.prepare("SELECT COUNT(*) as count FROM authors").get();
  const totalCategories = db.prepare("SELECT COUNT(*) as count FROM categories").get();
  const totalEvents = db.prepare("SELECT COUNT(*) as count FROM events").get();
  const unreadMessages = db.prepare("SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0").get();
  const totalMessages = db.prepare("SELECT COUNT(*) as count FROM contact_messages").get();

  const recentTexts = db.prepare(
    "SELECT t.id, t.title, t.slug, t.type, t.is_published, t.created_at, a.name as author_name FROM texts t LEFT JOIN authors a ON t.author_id = a.id ORDER BY t.created_at DESC LIMIT 5"
  ).all();

  const recentMessages = db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5").all();

  const textsByType = db.prepare("SELECT type, COUNT(*) as count FROM texts GROUP BY type").all();

  res.json({
    counts: {
      texts: totalTexts.count,
      published: publishedTexts.count,
      authors: totalAuthors.count,
      categories: totalCategories.count,
      events: totalEvents.count,
      messages: totalMessages.count,
      unreadMessages: unreadMessages.count,
    },
    recentTexts,
    recentMessages,
    textsByType,
  });
});

export default router;

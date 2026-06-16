import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import config from './config/index.js';
import { migrate } from './migrations/run.js';
import { seed } from './seeds/run.js';

import authRoutes from './routes/auth.js';
import authorRoutes from './routes/authors.js';
import categoryRoutes from './routes/categories.js';
import textRoutes from './routes/texts.js';
import eventRoutes from './routes/events.js';
import mediaRoutes from './routes/media.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';
import statsRoutes from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests' },
});
app.use('/api/', limiter);

const clientDist = join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));

app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/texts', textRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(clientDist, 'index.html'));
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

migrate();
seed();

app.listen(config.port, () => {
  console.log(`Al-Muna server running on port ${config.port}`);
});

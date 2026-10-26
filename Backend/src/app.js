import cors from 'cors';
import express from 'express';
import { identifyPlayer } from './middleware/auth.js';
import { aiRoutes } from './routes/ai.js';

// The web server. `userFromToken`, `ask` and `media` are passed in so the
// tests can use fakes instead of Supabase and Groq.
export function createApp({ userFromToken, ask, media = null, allowedOrigins = ['*'] }) {
  const app = express();
  app.disable('x-powered-by');
  // Render sits in front of the server, so trust its forwarded IP: guests
  // are rate-limited per device, not all together as one IP.
  app.set('trust proxy', 1);
  app.use(cors({ origin: allowedOrigins.includes('*') ? true : allowedOrigins }));
  // Handwriting sends pen strokes, which can be bigger than other requests
  app.use('/api/handwriting', express.json({ limit: '300kb' }));
  app.use(express.json({ limit: '50kb' }));

  // Render pings this to check the server is up
  app.get('/health', (req, res) => res.json({ ok: true }));

  // Signed-in players and guests can both use the AI (guests get a lower limit)
  app.use('/api', identifyPlayer(userFromToken), aiRoutes(ask, media));

  app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

  // Any error: log it, and send the player a short message (never the details)
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    const status = error.status && error.status < 600 ? error.status : 500;
    if (status >= 500) console.error(error);
    res.status(status).json({ error: status >= 500 && !error.status ? 'Something went wrong on the server.' : error.message });
  });

  return app;
}

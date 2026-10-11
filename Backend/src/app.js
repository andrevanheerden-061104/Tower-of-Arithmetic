import cors from 'cors';
import express from 'express';
import { requireUser } from './middleware/auth.js';
import { aiRoutes } from './routes/ai.js';

// The web server. `userFromToken` and `ask` are passed in so the tests can
// use fakes instead of Supabase and Groq.
export function createApp({ userFromToken, ask, allowedOrigins = ['*'] }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: allowedOrigins.includes('*') ? true : allowedOrigins }));
  app.use(express.json({ limit: '50kb' }));

  // Render pings this to check the server is up
  app.get('/health', (req, res) => res.json({ ok: true }));

  app.use('/api', requireUser(userFromToken), aiRoutes(ask));

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

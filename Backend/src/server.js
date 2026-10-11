import { config } from './config.js';
import { createApp } from './app.js';
import { askForJson } from './lib/groq.js';
import { userFromToken } from './lib/supabase.js';

const app = createApp({ userFromToken, ask: askForJson, allowedOrigins: config.allowedOrigins });

app.listen(config.port, () => {
  console.log(`Tower of Arithmetic API on port ${config.port} (model ${config.groqModel})`);
});

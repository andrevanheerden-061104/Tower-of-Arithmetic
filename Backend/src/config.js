import 'dotenv/config';

// Settings come from environment variables: the .env file while working on
// your computer, and Render's "Environment" page once it's hosted.

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to Backend/.env (see .env.example).`);
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  supabaseUrl: required('SUPABASE_URL'),
  supabasePublishableKey: required('SUPABASE_PUBLISHABLE_KEY'),
  groqApiKey: required('GROQ_API_KEY'),
  groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};

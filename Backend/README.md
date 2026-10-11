# Tower of Arithmetic – Backend

A small Node.js + Express API. It keeps the **Groq key off the phone** and
does the three AI jobs:

| Route | What it does |
|---|---|
| `GET /health` | Says the server is up (Render checks this). |
| `POST /api/questions` | Makes a batch of sums for a run, for the player's **grade** (1-11), the run's topic and three difficulty levels (`src/ai/curriculum.js`). Code works out every answer itself (`src/maths/solve.js`) and throws away any sum that is wrong, off topic, or has an answer the keypad can't type. |
| `POST /api/hint` | After a wrong answer, Orrin explains the mistake in 1–2 sentences without giving the answer. |
| `POST /api/run-summary` | Orrin's end-of-run message. The strength and the topic to practise are worked out by code from the run's results; the AI words it and reads the missed sums. A message with made-up numbers is thrown away. |

Every `/api` call needs the player's Supabase login token
(`Authorization: Bearer …`); the app sends it for you. Each player is
limited to a few calls a minute so the free Groq allowance lasts.

The backend never touches the database. The app reads and saves the
player's data in Supabase directly, and the database's privacy rules make
sure each player only reaches their own rows.

## 1. Set up the database (once)

1. Supabase dashboard → **SQL Editor** → **New query**.
2. Paste all of [`supabase/schema.sql`](supabase/schema.sql) and press **Run**.
   It makes the three tables from the ERD (`profiles`,
   `character_progress`, `topic_progress`), the privacy rules, and two
   helper functions the app calls (`record_answer`, `finish_run`).
3. **Authentication → Sign In / Providers → Email**: while testing, turn
   **Confirm email** off so new accounts can play straight away. (With it
   on, players must tap the link in their email before logging in; the app
   tells them so.)

You don't need to connect the GitHub repository to Supabase.

## 2. Run it on your computer

```bash
cd Backend
npm install
npm test        # checks the maths checker and AI handling
npm run dev     # starts on http://localhost:4000 and restarts on changes
```

Settings are in `.env` (copy `.env.example`). Never commit `.env`: the root
`.gitignore` already ignores it.

To test from a phone, set `EXPO_PUBLIC_API_URL` in the app's `.env` to your
computer's network address (e.g. `http://192.168.1.20:4000`), not localhost.

## 3. Host it on Render (free)

1. Push the repository to GitHub.
2. Render → **New → Web Service** → pick the repository.
3. **Root Directory:** `Backend` · **Build Command:** `npm install` ·
   **Start Command:** `npm start` · **Instance type:** Free.
4. **Environment:** add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
   `GROQ_API_KEY`, `GROQ_MODEL` (and `ALLOWED_ORIGINS` if you host the web
   version somewhere). Render sets `PORT` itself.
5. **Health Check Path:** `/health`.
6. Put the Render address (e.g. `https://tower-of-arithmetic-api.onrender.com`)
   in the app's `.env` as `EXPO_PUBLIC_API_URL`.

Render's free servers sleep after 15 minutes without visitors and take
about a minute to wake up. The app asks for questions when a run starts
and plays with its own questions until they arrive, so a sleeping server
never stops a fight. Open the app (or `/health`) a minute before a demo.

## Files

```
src/
  server.js            starts the server
  app.js               routes, login check, error handling
  config.js            reads .env
  routes/ai.js         /api/questions, /api/hint, /api/run-summary
  ai/curriculum.js     what each grade covers per topic and level (the AI's guide)
  ai/topics.js         the versions, and the test that a sum is on its topic
  maths/solve.js       works out sums, equations, patterns and data by code
  ai/questions.js      prompt + checking every AI question
  ai/hints.js          Orrin's wrong-answer hints (never the answer)
  ai/summary.js        Orrin's end-of-run message
  maths/evaluate.js    safe calculator used to check answers
  middleware/          login check, per-player rate limit
  lib/groq.js          Groq API (JSON replies, timeout, retry)
  lib/supabase.js      checks login tokens
supabase/schema.sql    the database
test/                  node --test
```

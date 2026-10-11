import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Reading and saving the player's data in Supabase. Only three tables (see
// Backend/supabase/schema.sql and the ERD):
//   profiles            the player
//   character_progress  each character's level and XP
//   topic_progress      running totals per maths topic
// Each function throws a readable Error if Supabase says no.
// ---------------------------------------------------------------------------

function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// --- login ---------------------------------------------------------------

export async function signUp({ username, email, password, grade }) {
  const data = check(
    await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, grade: grade ?? '' } },
    }),
  );
  // Supabase pretends a sign-up worked when the email already has an account
  // (so strangers can't check who plays). It sends NO email in that case; the
  // only clue is an empty identities list.
  if (data.user && !data.session && (data.user.identities ?? []).length === 0) {
    throw new Error('User already registered');
  }
  // No session means Supabase wants the email confirmed first (with the
  // code it just emailed)
  return { session: data.session, needsConfirmation: !data.session };
}

// The code from the "confirm your email" email. Logs the player in.
export async function verifyEmailCode({ email, code }) {
  const first = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
  if (!first.error) return first.data.session;
  // Older Supabase projects use the 'signup' type for this code
  const second = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });
  return check(second).session;
}

// Email a new code (the old one stops working).
export async function resendEmailCode(email) {
  check(await supabase.auth.resend({ type: 'signup', email }));
}

export async function signIn({ email, password }) {
  return check(await supabase.auth.signInWithPassword({ email, password })).session;
}

export async function signOut() {
  check(await supabase.auth.signOut());
}

// --- reading -------------------------------------------------------------

export async function loadPlayer(userId) {
  const [profile, characters, topics] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('character_progress').select('character_id, level, xp').eq('user_id', userId),
    supabase.from('topic_progress').select('topic, version, attempts, correct, time_ms_total, hints_total').eq('user_id', userId),
  ]);
  return {
    profile: check(profile),
    characters: Object.fromEntries(check(characters).map((c) => [c.character_id, { level: c.level, xp: c.xp }])),
    topics: check(topics),
  };
}

// --- saving --------------------------------------------------------------

// Change some of the profile's fields: username, grade, character_id,
// tutorial_done or settings. Returns the saved profile.
export async function updateProfile(userId, changes) {
  return check(await supabase.from('profiles').update(changes).eq('id', userId).select().single());
}

// One answered sum: added to that topic's running totals.
export async function recordAnswer({ topic, version, correct, timeMs, hints }) {
  check(
    await supabase.rpc('record_answer', {
      p_topic: topic,
      p_version: version,
      p_correct: correct,
      p_time_ms: Math.round(timeMs || 0),
      p_hints: hints || 0,
    }),
  );
}

// End of a run: XP to the player and the character, levels, run totals.
// Returns the updated profile.
export async function finishRun({ floorsCleared, xp, characterId }) {
  return check(
    await supabase.rpc('finish_run', { p_floors_cleared: floorsCleared, p_xp: xp, p_character: characterId }),
  );
}

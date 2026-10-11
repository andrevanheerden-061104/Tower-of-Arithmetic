import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Calls to our own backend (the Backend folder): AI questions, hints and
// run summaries. The address comes from EXPO_PUBLIC_API_URL in .env. Every
// call sends the player's login so the backend knows who is asking.
// ---------------------------------------------------------------------------

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {}

export async function apiPost(path, body, { timeoutMs = 20000 } = {}) {
  if (!API_URL || !supabase) throw new ApiError('The game server is not set up.');
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new ApiError('Please log in first.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(json.error || `The game server replied ${res.status}.`);
    return json;
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError('The game server took too long to answer.');
    if (error instanceof ApiError) throw error;
    throw new ApiError("Can't reach the game server.");
  } finally {
    clearTimeout(timer);
  }
}

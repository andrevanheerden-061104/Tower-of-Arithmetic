import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Calls to our own backend (the Backend folder): AI questions, hints and
// run summaries. The address comes from EXPO_PUBLIC_API_URL in .env. Every
// call sends the player's login so the backend knows who is asking.
// ---------------------------------------------------------------------------

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {}

export function apiPost(path, body, { timeoutMs = 20000 } = {}) {
  return send(path, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, timeoutMs);
}

// Send a file (FormData). fetch sets the Content-Type itself.
export function apiUpload(path, form, { timeoutMs = 30000 } = {}) {
  return send(path, { body: form }, timeoutMs);
}

async function loginToken() {
  if (!API_URL || !supabase) throw new ApiError('The game server is not set up.');
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new ApiError('Please log in first.');
  return token;
}

// Send a file from the phone ({ uri, name, type }) with React Native's own
// XMLHttpRequest. Expo's fetch can't send a file by its address
// ("Unsupported FormDataPart implementation"), but this always could.
export async function apiUploadFile(path, file, { timeoutMs = 30000 } = {}) {
  const token = await loginToken();
  const form = new FormData();
  form.append('file', file);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.timeout = timeoutMs;
    xhr.onload = () => {
      let json = {};
      try {
        json = JSON.parse(xhr.responseText || '{}');
      } catch {
        json = {};
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(json);
      else reject(new ApiError(json.error || `The game server replied ${xhr.status}.`));
    };
    xhr.ontimeout = () => reject(new ApiError('The game server took too long to answer.'));
    xhr.onerror = () => {
      console.warn(`API ${path} upload failed`);
      reject(new ApiError("Can't reach the game server. Check your internet and try again."));
    };
    xhr.send(form);
  });
}

async function send(path, { headers = {}, body }, timeoutMs) {
  const token = await loginToken();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}`, ...headers },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(json.error || `The game server replied ${res.status}.`);
    return json;
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError('The game server took too long to answer.');
    if (error instanceof ApiError) throw error;
    console.warn(`API ${path} failed:`, error?.message ?? error);
    throw new ApiError("Can't reach the game server. Check your internet and try again.");
  } finally {
    clearTimeout(timer);
  }
}

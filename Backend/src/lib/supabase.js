import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Only used to check who is calling: the app sends the player's login token
// with every request, and Supabase says whose it is. The backend never
// reads or writes the database itself (the app does that, under the
// database's privacy rules).
const supabase = createClient(config.supabaseUrl, config.supabasePublishableKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function userFromToken(token) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

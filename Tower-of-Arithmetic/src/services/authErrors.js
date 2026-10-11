// Supabase's login errors in words a young player understands.
export function friendlyAuthError(message = '') {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'That email and password don’t match. Check them and try again.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'There’s already an account with that email. Log in instead.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first with the code we sent you.';
  if (m.includes('email rate limit') || m.includes('over_email_send_rate_limit')) return 'The tower has sent too many emails this hour. Wait an hour, then ask for a new code.';
  if (m.includes('security purposes') || m.includes('only request this after')) return 'A code was just sent. Wait a minute before asking for another one.';
  if (m.includes('sending confirmation') || m.includes('sending email')) return 'The tower couldn’t send the email. Please try again later.';
  if (m.includes('expired') || m.includes('invalid') && m.includes('token')) return 'That code is wrong or too old. Ask for a new code.';
  if (m.includes('password')) return 'Your password needs at least 8 characters.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many tries. Wait a minute, then try again.';
  if (m.includes('network') || m.includes('fetch')) return 'Can’t reach the tower. Check your internet connection.';
  return 'Something went wrong. Please try again.';
}

// Check the sign-up form before sending it. Returns a message, or null.
export function checkSignup({ username, email, password }) {
  if (username.trim().length < 2 || username.trim().length > 24) return 'Your wizard name needs 2 to 24 letters.';
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'That email doesn’t look right.';
  if (password.length < 8) return 'Your password needs at least 8 characters.';
  return null;
}

export function checkLogin({ email, password }) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'That email doesn’t look right.';
  if (!password) return 'Enter your password.';
  return null;
}

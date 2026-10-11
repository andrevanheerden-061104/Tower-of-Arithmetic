// Every /api request must come from a signed-in player. The app sends the
// player's Supabase login token as "Authorization: Bearer <token>".
export function requireUser(userFromToken) {
  return async (req, res, next) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Please log in first.' });
    const user = await userFromToken(token).catch(() => null);
    if (!user) return res.status(401).json({ error: 'Your login has expired. Please log in again.' });
    req.user = user;
    next();
  };
}

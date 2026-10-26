// Works out who is asking. A signed-in player sends their Supabase login
// token as "Authorization: Bearer <token>"; a guest sends no token.
//   - no token        -> a guest (req.user stays empty). Guests can use the
//                        AI too, but get a smaller rate limit per device.
//   - a valid token   -> req.user is the player
//   - a broken token  -> 401, so the app can ask them to log in again
export function identifyPlayer(userFromToken) {
  return async (req, res, next) => {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
    if (!token) {
      req.user = null;
      req.guest = true;
      return next();
    }
    const user = await userFromToken(token).catch(() => null);
    if (!user) return res.status(401).json({ error: 'Your login has expired. Please log in again.' });
    req.user = user;
    next();
  };
}

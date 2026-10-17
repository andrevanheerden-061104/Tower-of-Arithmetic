import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  finishRun as saveRun,
  loadPlayer,
  recordAnswer as saveAnswer,
  signIn as logIn,
  signOut as logOut,
  resendEmailCode,
  resetPasswordWithCode,
  sendPasswordReset,
  signUp as createAccount,
  updateProfile as saveProfile,
  verifyEmailCode,
} from '../services/playerData';
import { xpToNextLevel } from '../data/playerLevels';

// XP for finishing a Spell School lesson (the first time, logged in only)
export const LESSON_XP = 50;

// ---------------------------------------------------------------------------
// The signed-in player, shared with every screen (read it with usePlayer()).
//
//   ready       false until we know whether someone is logged in
//   online      false when Supabase isn't set up: the game runs as a guest
//   signedIn    someone is logged in
//   profile     their profile row (username, grade, xp, level, ...)
//   characters  { shadow: { level, xp }, ... }
//   topics      [{ topic, attempts, correct, time_ms_total, hints_total }]
//   pendingEmail  the email waiting for its confirmation code (or null)
//
//   guestStats  a guest's runs and highest floor, kept only while the app
//               is open (for badges); nothing of a guest's is saved
//
// and the actions: signUp, verifyCode, resendCode, signIn, signOut,
// requestPasswordReset, resetPassword, updateProfile, recordAnswer,
// finishRun, xpChanges, lessonXpFor. Saving never blocks the game: if it fails, the answer is kept
// and sent again with the next one.
// ---------------------------------------------------------------------------

export const PlayerContext = createContext(null);

const EMPTY = { userId: null, profile: null, characters: {}, topics: [] };

export function PlayerProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!supabase);
  const [data, setData] = useState(EMPTY);
  const pending = useRef([]); // answers still waiting to be saved
  const [pendingEmail, setPendingEmail] = useState(null);
  const [guestStats, setGuestStats] = useState({ runs_completed: 0, highest_floor: 0 });
  const userId = session?.user?.id ?? null;

  // Who is logged in (and stay up to date as that changes)
  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data: result }) => {
      setSession(result.session);
      setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load the player's saved data when they log in
  useEffect(() => {
    if (!userId) return undefined;
    let current = true;
    loadPlayer(userId)
      .then((loaded) => current && setData({ userId, ...loaded }))
      .catch((error) => console.warn('Could not load the player:', error.message));
    return () => {
      current = false;
    };
  }, [userId]);

  // Only show data that belongs to whoever is logged in now
  const mine = data.userId === userId ? data : EMPTY;

  const signUp = useCallback(async (values) => {
    if (!supabase) return { needsConfirmation: false };
    const result = await createAccount(values);
    setPendingEmail(result.needsConfirmation ? values.email : null);
    return result;
  }, []);

  // The 6-digit code from the email: confirms the account and logs in.
  // Returns the player's profile.
  const verifyCode = useCallback(
    async (code) => {
      const next = await verifyEmailCode({ email: pendingEmail, code });
      const loaded = await loadPlayer(next.user.id);
      setData({ userId: next.user.id, ...loaded });
      setPendingEmail(null);
      return loaded.profile;
    },
    [pendingEmail],
  );

  // Email a fresh code (to `email`, or the one waiting for a code)
  const resendCode = useCallback(
    async (email = pendingEmail) => {
      await resendEmailCode(email);
      setPendingEmail(email);
    },
    [pendingEmail],
  );

  // Log in and load the player straight away. Returns their profile.
  const signIn = useCallback(async (values) => {
    if (!supabase) return null;
    const next = await logIn(values);
    const loaded = await loadPlayer(next.user.id);
    setData({ userId: next.user.id, ...loaded });
    return loaded.profile;
  }, []);

  // Forgot password: email a reset code, then the code + a new password log
  // the player in. Returns their profile.
  const requestPasswordReset = useCallback(async (email) => {
    if (!supabase) return;
    await sendPasswordReset(email);
  }, []);
  const resetPassword = useCallback(async (values) => {
    const next = await resetPasswordWithCode(values);
    const loaded = await loadPlayer(next.user.id);
    setData({ userId: next.user.id, ...loaded });
    return loaded.profile;
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await logOut();
    setData(EMPTY);
  }, []);

  // Change the profile now on screen, then save it
  const updateProfile = useCallback(
    async (changes) => {
      setData((old) => (old.profile ? { ...old, profile: { ...old.profile, ...changes } } : old));
      if (!supabase || !userId) return;
      try {
        const saved = await saveProfile(userId, changes);
        setData((old) => (old.userId === userId ? { ...old, profile: saved } : old));
      } catch (error) {
        console.warn('Could not save the profile:', error.message);
      }
    },
    [userId],
  );

  // One answered sum: count it on screen straight away, then save it
  const recordAnswer = useCallback(
    async (answer) => {
      setData((old) => {
        if (!old.userId) return old;
        const topics = [...old.topics];
        const i = topics.findIndex((t) => t.topic === answer.topic);
        const t = i >= 0 ? { ...topics[i] } : { topic: answer.topic, version: answer.version, attempts: 0, correct: 0, time_ms_total: 0, hints_total: 0 };
        t.attempts += 1;
        t.correct += answer.correct ? 1 : 0;
        t.time_ms_total += Math.round(answer.timeMs || 0);
        t.hints_total += answer.hints || 0;
        if (i >= 0) topics[i] = t;
        else topics.push(t);
        return { ...old, topics };
      });
      if (!supabase || !userId) return;
      pending.current.push(answer);
      const queue = pending.current.splice(0);
      for (let i = 0; i < queue.length; i++) {
        try {
          await saveAnswer(queue[i]);
        } catch {
          pending.current.unshift(...queue.slice(i)); // try these again next time
          return;
        }
      }
    },
    [userId],
  );

  // End of a run: save XP, levels and run totals, then reload everything
  const finishRun = useCallback(
    async (result) => {
      if (!supabase || !userId) {
        // A guest: count it for this visit only (badges), save nothing
        setGuestStats((s) => ({ runs_completed: s.runs_completed + 1, highest_floor: Math.max(s.highest_floor, result.floorsCleared ?? 0) }));
        return;
      }
      try {
        await saveRun(result);
        const loaded = await loadPlayer(userId);
        setData({ userId, ...loaded });
      } catch (error) {
        console.warn('Could not save the run:', error.message);
      }
    },
    [userId],
  );

  // The profile changes ({ xp, level }) for gaining `amount` XP, levelling
  // up like finish_run does on the server. null for a guest.
  const profileNow = mine.profile;
  const xpChanges = useCallback(
    (amount) => {
      if (!profileNow || !userId) return null;
      let xp = (profileNow.xp ?? 0) + amount;
      let level = profileNow.level ?? 1;
      while (xp >= xpToNextLevel(level)) {
        xp -= xpToNextLevel(level);
        level += 1;
      }
      return { xp, level };
    },
    [profileNow, userId],
  );

  // XP a lesson will give when finished: only the first time, logged in
  const lessonXpFor = useCallback(
    (lessonId) => (profileNow && userId && !(profileNow.settings?.lessonsDone ?? []).includes(lessonId) ? LESSON_XP : 0),
    [profileNow, userId],
  );

  const value = useMemo(
    () => ({
      ready,
      online: Boolean(supabase),
      signedIn: Boolean(userId),
      user: session?.user ?? null,
      profile: mine.profile,
      characters: mine.characters,
      topics: mine.topics,
      pendingEmail,
      signUp,
      verifyCode,
      resendCode,
      signIn,
      signOut,
      requestPasswordReset,
      resetPassword,
      updateProfile,
      recordAnswer,
      finishRun,
      guestStats,
      xpChanges,
      lessonXpFor,
    }),
    [ready, userId, session, mine, pendingEmail, signUp, verifyCode, resendCode, signIn, signOut, requestPasswordReset, resetPassword, updateProfile, recordAnswer, finishRun, guestStats, xpChanges, lessonXpFor],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

import { useState } from 'react';
import { View } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthTabs from '../../components/auth/AuthTabs';
import GuestButton from '../../components/auth/GuestButton';
import { usePlayer } from '../../hooks/usePlayer';
import { checkLogin, friendlyAuthError } from '../../services/authErrors';
import LoginForm from './components/LoginForm';
import styles from './Login.styles';

// Log in, then straight to Home (or to choosing a grade, if the player
// hasn't picked one yet). Without Supabase set up, it moves on as a guest.
export default function Login({ navigate, onPlayAsGuest }) {
  const onGuest = onPlayAsGuest ?? (() => navigate('onboarding'));
  const { signIn, resendCode, online } = usePlayer();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async (values) => {
    const problem = checkLogin(values);
    if (problem && online) return setMessage({ text: problem, tone: 'error' });
    setBusy(true);
    setMessage(null);
    try {
      const profile = await signIn(values);
      navigate(online && !profile?.grade ? 'onboarding' : 'home');
    } catch (error) {
      // Signed up but never typed in the email code: send a new one
      if (error.message.toLowerCase().includes('not confirmed')) {
        await resendCode(values.email).catch(() => {});
        navigate('verifyEmail');
        return undefined;
      }
      setMessage({ text: friendlyAuthError(error.message), tone: 'error' });
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <AuthLayout>
      <AuthHeader title="Welcome back, apprentice" subtitle="Log in to continue your climb." />

      <View style={styles.form}>
        <AuthTabs active="login" onChange={(tab) => tab === 'signup' && navigate('signup')} />
        <LoginForm onSubmit={submit} onSwitch={() => navigate('signup')} busy={busy} message={message} />
        <GuestButton onPress={onGuest} />
      </View>
    </AuthLayout>
  );
}

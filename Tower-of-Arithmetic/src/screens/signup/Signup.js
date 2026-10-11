import { useState } from 'react';
import { View } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthTabs from '../../components/auth/AuthTabs';
import { usePlayer } from '../../hooks/usePlayer';
import { checkSignup, friendlyAuthError } from '../../services/authErrors';
import SignupForm from './components/SignupForm';
import styles from './Signup.styles';

// Create account. Makes the Supabase account (the database makes the
// profile from the username). Supabase then emails a 6-digit code, typed
// in on the next screen (VerifyEmail). If email confirmation is switched
// off in Supabase, it goes straight on to choosing a grade. Without
// Supabase set up, it just moves on as a guest.
export default function Signup({ navigate }) {
  const { signUp, online } = usePlayer();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async (values) => {
    const problem = checkSignup(values);
    if (problem && online) return setMessage({ text: problem, tone: 'error' });
    setBusy(true);
    setMessage(null);
    try {
      const { needsConfirmation } = await signUp(values);
      navigate(needsConfirmation ? 'verifyEmail' : 'onboarding');
    } catch (error) {
      setMessage({ text: friendlyAuthError(error.message), tone: 'error' });
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Begin your apprenticeship"
        subtitle="Create an account so the tower remembers your progress."
      />

      <View style={styles.form}>
        <AuthTabs active="signup" onChange={(tab) => tab === 'login' && navigate('login')} />
        <SignupForm onSubmit={submit} onSwitch={() => navigate('login')} busy={busy} message={message} />
      </View>
    </AuthLayout>
  );
}

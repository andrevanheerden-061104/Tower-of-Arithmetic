import { useState } from 'react';
import { View } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthSwitchLink from '../../components/auth/AuthSwitchLink';
import FormMessage from '../../components/auth/FormMessage';
import PrimaryButton from '../../components/PrimaryButton';
import { usePlayer } from '../../hooks/usePlayer';
import { friendlyAuthError } from '../../services/authErrors';
import CodeInput from './components/CodeInput';
import ResendCode from './components/ResendCode';
import styles from './VerifyEmail.styles';

const LENGTH = 6;

// After creating an account: Supabase emails a 6-digit code, and the player
// types it here to confirm their email. Then on to choosing a grade (or
// Home, if they already have one).
export default function VerifyEmail({ navigate }) {
  const { pendingEmail, verifyCode, resendCode } = usePlayer();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const confirm = async (value = code) => {
    if (busy) return;
    if (value.length !== LENGTH) {
      setMessage({ text: `Type all ${LENGTH} numbers from the email.`, tone: 'error' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const profile = await verifyCode(value);
      navigate(profile?.grade ? 'home' : 'onboarding');
    } catch (error) {
      const m = error.message.toLowerCase();
      setMessage({
        text: m.includes('expired') || m.includes('invalid') || m.includes('token')
          ? 'That code didn’t work. Check the numbers, or send a new code.'
          : friendlyAuthError(error.message),
        tone: 'error',
      });
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    try {
      await resendCode();
      setMessage({ text: 'A new code is on its way. Check your email.', tone: 'info' });
    } catch (error) {
      setMessage({ text: friendlyAuthError(error.message), tone: 'error' });
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Check your email"
        subtitle={`We sent a ${LENGTH}-digit code to ${pendingEmail ?? 'your email'}. Type it in to open the tower.`}
      />

      <View style={styles.form}>
        <CodeInput value={code} onChange={setCode} length={LENGTH} onComplete={confirm} />
        <FormMessage text={message?.text} tone={message?.tone} />

        <View style={styles.actions}>
          <PrimaryButton label={busy ? 'Checking…' : 'Confirm'} disabled={busy} onPress={() => confirm()} />
          <ResendCode onResend={resend} />
          <AuthSwitchLink question="Wrong email?" action="Start again" onPress={() => navigate('signup')} />
        </View>
      </View>
    </AuthLayout>
  );
}

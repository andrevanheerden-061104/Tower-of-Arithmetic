import { useState } from 'react';
import { View } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthSwitchLink from '../../components/auth/AuthSwitchLink';
import FormMessage from '../../components/auth/FormMessage';
import TextField from '../../components/auth/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { usePlayer } from '../../hooks/usePlayer';
import { friendlyAuthError } from '../../services/authErrors';
import CodeInput from '../verifyEmail/components/CodeInput';
import ResendCode from '../verifyEmail/components/ResendCode';
import styles from '../verifyEmail/VerifyEmail.styles';

const LENGTH = 6;

// The email typed on the Log in screen, so the player doesn't type it twice
let rememberedEmail = '';
export function rememberEmail(email) {
  rememberedEmail = email ?? '';
}

// Forgot password, in two steps (like confirming a new account):
//   1. type your email: Supabase emails a 6-digit reset code
//   2. type the code and a new password: you're logged in with it
export default function ForgotPassword({ navigate }) {
  const { requestPasswordReset, resetPassword, online } = usePlayer();
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [email, setEmail] = useState(rememberedEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const sendCode = async () => {
    const address = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setMessage({ text: 'That email doesn’t look right.', tone: 'error' });
      return;
    }
    if (!online) {
      setMessage({ text: 'Accounts aren’t set up in this version, so there’s no password to reset.', tone: 'error' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await requestPasswordReset(address);
      setStep('code');
      setMessage({ text: 'If that email has an account, a code is on its way.', tone: 'info' });
    } catch (error) {
      setMessage({ text: friendlyAuthError(error.message), tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (busy) return;
    if (code.length !== LENGTH) {
      setMessage({ text: `Type all ${LENGTH} numbers from the email.`, tone: 'error' });
      return;
    }
    if (password.length < 8) {
      setMessage({ text: 'Your new password needs at least 8 characters.', tone: 'error' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const profile = await resetPassword({ email: email.trim(), code, password });
      navigate(profile?.grade ? 'home' : 'onboarding');
    } catch (error) {
      const m = error.message.toLowerCase();
      setMessage({
        text:
          m.includes('expired') || (m.includes('invalid') && !m.includes('password')) || m.includes('token')
            ? 'That code didn’t work. Check the numbers, or send a new code.'
            : friendlyAuthError(error.message),
        tone: 'error',
      });
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    try {
      await requestPasswordReset(email.trim());
      setMessage({ text: 'A new code is on its way. Check your email.', tone: 'info' });
    } catch (error) {
      setMessage({ text: friendlyAuthError(error.message), tone: 'error' });
    }
  };

  if (step === 'email') {
    return (
      <AuthLayout>
        <AuthHeader title="Forgot your password?" subtitle="Type your email and we’ll send you a 6-digit code to choose a new one." />
        <View style={styles.form}>
          <TextField
            label="Email"
            placeholder="you@email.com"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />
          <FormMessage text={message?.text} tone={message?.tone} />
          <View style={styles.actions}>
            <PrimaryButton label={busy ? 'Sending…' : 'Send reset code'} disabled={busy} onPress={sendCode} />
            <AuthSwitchLink question="Remembered it?" action="Log in" onPress={() => navigate('login')} />
          </View>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader title="Check your email" subtitle={`We sent a ${LENGTH}-digit code to ${email.trim()}. Type it in, then choose a new password.`} />
      <View style={styles.form}>
        <CodeInput value={code} onChange={setCode} length={LENGTH} />
        <TextField
          label="New password"
          placeholder="At least 8 characters"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete="new-password"
        />
        <FormMessage text={message?.text} tone={message?.tone} />
        <View style={styles.actions}>
          <PrimaryButton label={busy ? 'Saving…' : 'Save new password'} disabled={busy} onPress={save} />
          <ResendCode onResend={resend} />
          <AuthSwitchLink
            question="Wrong email?"
            action="Start again"
            onPress={() => {
              setStep('email');
              setCode('');
              setMessage(null);
            }}
          />
        </View>
      </View>
    </AuthLayout>
  );
}

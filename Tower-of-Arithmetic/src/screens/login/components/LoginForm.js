import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthSwitchLink from '../../../components/auth/AuthSwitchLink';
import PrimaryButton from '../../../components/PrimaryButton';
import FormMessage from '../../../components/auth/FormMessage';
import TextField from '../../../components/auth/TextField';
import ForgotPasswordLink from './ForgotPasswordLink';

// Email and password. "Enter the tower" hands them to the screen, which
// logs in. `message` is { text, tone }.
export default function LoginForm({ onSubmit, onSwitch, onForgot, busy = false, message }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.wrap}>
      <View style={styles.fields}>
        <TextField
          label="Email"
          placeholder="you@email.com"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextField
          label="Password"
          placeholder="Your password"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete="current-password"
        />
        <ForgotPasswordLink onPress={() => onForgot?.(email.trim())} />
      </View>

      <FormMessage text={message?.text} tone={message?.tone} />

      <View style={styles.actions}>
        <PrimaryButton
          label={busy ? 'Opening the tower…' : 'Enter the tower'}
          disabled={busy}
          onPress={() => onSubmit({ email: email.trim(), password })}
        />
        <AuthSwitchLink question="New to the tower?" action="Create account" onPress={onSwitch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 24 },
  fields: { gap: 14 },
  actions: { gap: 4 },
});

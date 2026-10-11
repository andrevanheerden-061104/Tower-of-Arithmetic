import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthSwitchLink from '../../../components/auth/AuthSwitchLink';
import PrimaryButton from '../../../components/PrimaryButton';
import FormMessage from '../../../components/auth/FormMessage';
import TextField from '../../../components/auth/TextField';

// Username, email and password. "Create account" hands them to the screen,
// which checks them and makes the account. `message` is { text, tone }.
export default function SignupForm({ onSubmit, onSwitch, busy = false, message }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.wrap}>
      <View style={styles.fields}>
        <TextField
          label="Username"
          placeholder="Your wizard name"
          icon="user"
          value={username}
          onChangeText={setUsername}
          autoComplete="username"
        />
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
          placeholder="At least 8 characters"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete="new-password"
        />
      </View>

      <FormMessage text={message?.text} tone={message?.tone} />

      <View style={styles.actions}>
        <PrimaryButton
          label={busy ? 'Creating account…' : 'Create account'}
          disabled={busy}
          onPress={() => onSubmit({ username: username.trim(), email: email.trim(), password })}
        />
        <AuthSwitchLink question="Already an apprentice?" action="Log in" onPress={onSwitch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 24 },
  fields: { gap: 14 },
  actions: { gap: 4 },
});

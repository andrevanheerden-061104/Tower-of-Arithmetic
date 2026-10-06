import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthSwitchLink from '../../../components/auth/AuthSwitchLink';
import PrimaryButton from '../../../components/PrimaryButton';
import TextField from '../../../components/auth/TextField';

// Username, email and password. The values live only in this component
// for now; nothing is validated or sent anywhere.
export default function SignupForm({ onSubmit, onSwitch }) {
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

      <View style={styles.actions}>
        <PrimaryButton label="Create account" onPress={onSubmit} />
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

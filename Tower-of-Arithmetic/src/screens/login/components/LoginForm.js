import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthSwitchLink from '../../../components/auth/AuthSwitchLink';
import PrimaryButton from '../../../components/PrimaryButton';
import TextField from '../../../components/auth/TextField';
import ForgotPasswordLink from './ForgotPasswordLink';

// Email and password. Nothing is checked or sent anywhere yet.
export default function LoginForm({ onSubmit, onSwitch }) {
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
        <ForgotPasswordLink onPress={() => {}} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Enter the tower" onPress={onSubmit} />
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

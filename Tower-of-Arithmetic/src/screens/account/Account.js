import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Text from '../../components/AppText';
import FormMessage from '../../components/auth/FormMessage';
import TextField from '../../components/auth/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenBackground from '../../components/ScreenBackground';
import ScreenHeader from '../../components/ScreenHeader';
import Shade from '../../components/Shade';
import { usePlayer } from '../../hooks/usePlayer';
import { friendlyAuthError } from '../../services/authErrors';
import { colors, fonts, spacing } from '../../theme/theme';

const DANGER = '#FF8A80';

// Account (opened from Profile): change the username or password, log
// out, or delete the account and everything saved for it. Deleting is
// asked twice, because it can't be undone. A guest has no account, so
// they're offered one instead.
export default function Account({ navigate }) {
  const { profile, user, signedIn, updateProfile, changePassword, deleteAccount, signOut } = usePlayer();

  if (!signedIn || !profile) {
    return (
      <Layout navigate={navigate}>
        <Group title="Playing as a guest">
          <Text style={styles.body}>Nothing a guest does is saved. Make an account to keep your levels, badges and runs.</Text>
          <PrimaryButton label="Create an account" onPress={() => navigate('signup')} />
        </Group>
      </Layout>
    );
  }

  return (
    <Layout navigate={navigate}>
      <UsernameForm current={profile.username} onSave={(username) => updateProfile({ username })} />
      <PasswordForm onSave={changePassword} />
      <Group title="Log out">
        <Text style={styles.body}>Logged in as {user?.email}.</Text>
        <PrimaryButton
          label="Log out"
          variant="secondary"
          onPress={async () => {
            await signOut().catch(() => {});
            navigate('login');
          }}
        />
      </Group>
      <DeleteAccount
        onDelete={async () => {
          await deleteAccount();
          navigate('signup');
        }}
      />
    </Layout>
  );
}

function Layout({ navigate, children }) {
  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.25} />
      <Shade stops={[[0, 0.8], [0.3, 0.92], [1, 1]]} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Account" onBack={() => navigate('profile')} />
        {children}
      </ScrollView>
    </View>
  );
}

function Group({ title, danger, children }) {
  return (
    <View style={styles.group}>
      <Text style={[styles.title, danger && styles.dangerText]} accessibilityRole="header">
        {title}
      </Text>
      <View style={[styles.panel, danger && styles.dangerPanel]}>{children}</View>
    </View>
  );
}

function UsernameForm({ current, onSave }) {
  const [name, setName] = useState(current ?? '');
  const [message, setMessage] = useState(null);
  const save = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 24) {
      setMessage({ text: 'Your username needs 2 to 24 characters.', tone: 'error' });
      return;
    }
    onSave(trimmed);
    setName(trimmed);
    setMessage({ text: 'Username saved.', tone: 'info' });
  };
  return (
    <Group title="Change username">
      <TextField label="Username" placeholder="2 to 24 characters" icon="user" value={name} onChangeText={setName} maxLength={24} autoComplete="username" />
      <FormMessage text={message?.text} tone={message?.tone} />
      <PrimaryButton label="Save username" disabled={name.trim() === current} onPress={save} />
    </Group>
  );
}

function PasswordForm({ onSave }) {
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const save = async () => {
    if (password.length < 8) {
      setMessage({ text: 'Your new password needs at least 8 characters.', tone: 'error' });
      return;
    }
    if (password !== again) {
      setMessage({ text: 'The two passwords aren’t the same.', tone: 'error' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await onSave(password);
      setPassword('');
      setAgain('');
      setMessage({ text: 'Password changed.', tone: 'info' });
    } catch (error) {
      setMessage({ text: friendlyAuthError(error.message), tone: 'error' });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Group title="Change password">
      <TextField label="New password" placeholder="At least 8 characters" icon="lock" value={password} onChangeText={setPassword} secure autoComplete="new-password" />
      <TextField label="Type it again" placeholder="The same password" icon="lock" value={again} onChangeText={setAgain} secure autoComplete="new-password" />
      <FormMessage text={message?.text} tone={message?.tone} />
      <PrimaryButton label={busy ? 'Saving…' : 'Change password'} disabled={busy || !password} onPress={save} />
    </Group>
  );
}

function DeleteAccount({ onDelete }) {
  const [sure, setSure] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const remove = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await onDelete();
    } catch (error) {
      setBusy(false);
      setMessage({ text: `Your account couldn’t be deleted. ${error.message}`, tone: 'error' });
    }
  };
  return (
    <Group title="Delete account" danger>
      <Text style={styles.body}>
        This deletes your login and everything saved with it: your levels, characters, badges, maths progress and saved run. It can’t be undone.
      </Text>
      <FormMessage text={message?.text} tone={message?.tone} />
      {sure ? (
        <>
          <Text style={[styles.body, styles.dangerText]}>Are you sure? Everything will be gone for good.</Text>
          <PrimaryButton label={busy ? 'Deleting…' : 'Yes, delete my account'} disabled={busy} onPress={remove} style={styles.dangerButton} />
          <PrimaryButton label="Cancel" variant="secondary" disabled={busy} onPress={() => setSure(false)} />
        </>
      ) : (
        <PrimaryButton label="Delete my account" variant="secondary" onPress={() => setSure(true)} style={styles.dangerButton} />
      )}
    </Group>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { gap: 22, paddingTop: spacing.top, paddingBottom: spacing.bottom, paddingHorizontal: spacing.gutter },
  group: { gap: 8 },
  title: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.gold },
  panel: { gap: 14, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.panel },
  body: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.pink },
  dangerText: { color: DANGER },
  dangerPanel: { borderColor: 'rgba(255,138,128,0.45)' },
  dangerButton: { borderColor: DANGER },
});

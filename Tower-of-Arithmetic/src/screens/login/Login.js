import { View } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthTabs from '../../components/auth/AuthTabs';
import LoginForm from './components/LoginForm';
import styles from './Login.styles';

// Log in screen. No backend yet: the button goes straight to onboarding.
export default function Login({ navigate }) {
  return (
    <AuthLayout>
      <AuthHeader title="Welcome back, apprentice" subtitle="Log in to continue your climb." />

      <View style={styles.form}>
        <AuthTabs active="login" onChange={(tab) => tab === 'signup' && navigate('signup')} />
        <LoginForm onSubmit={() => navigate('onboarding')} onSwitch={() => navigate('signup')} />
      </View>
    </AuthLayout>
  );
}

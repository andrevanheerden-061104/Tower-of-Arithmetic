import { View } from 'react-native';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthTabs from '../../components/auth/AuthTabs';
import SignupForm from './components/SignupForm';
import styles from './Signup.styles';

// Create account screen. There is no backend yet, so the button
// simply moves on to onboarding without saving anything.
export default function Signup({ navigate }) {
  return (
    <AuthLayout>
      <AuthHeader
        title="Begin your apprenticeship"
        subtitle="Create an account so the tower remembers your progress."
      />

      <View style={styles.form}>
        <AuthTabs active="signup" onChange={(tab) => tab === 'login' && navigate('login')} />
        <SignupForm onSubmit={() => navigate('onboarding')} onSwitch={() => navigate('login')} />
      </View>
    </AuthLayout>
  );
}

import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import GradeGroup from './components/GradeGroup';
import StepBar from './components/StepBar';
import styles from './Onboarding.styles';

// CAPS phases and the grades in each one.
const PHASES = [
  { name: 'Foundation phase', grades: [1, 2, 3] },
  { name: 'Intermediate phase', grades: [4, 5, 6] },
  { name: 'Senior phase', grades: [7, 8, 9] },
  { name: 'FET phase', grades: [10, 11] },
];

// The player picks their school grade. The choice is handed to App.js
// (kept in memory only) and then we move on to the home screen.
export default function Onboarding({ navigate, onGradeChosen }) {
  const [grade, setGrade] = useState(null);

  const handleContinue = () => {
    onGradeChosen?.(grade);
    navigate('home');
  };

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.22} />
      <Shade stops={[[0, 0.55], [0.45, 0.9], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <StepBar step={2} total={2} onBack={() => navigate('signup')} />
          <View style={styles.titleBlock}>
            <Text style={styles.title} accessibilityRole="header">
              Choose your grade
            </Text>
            <Text style={styles.subtitle}>
              The tower sets its equations to your CAPS grade. You can change this later in Settings.
            </Text>
          </View>
        </View>

        <View style={styles.groups} accessibilityRole="radiogroup">
          {PHASES.map((phase) => (
            <GradeGroup
              key={phase.name}
              name={phase.name}
              grades={phase.grades}
              selected={grade}
              onSelect={setGrade}
            />
          ))}
        </View>

        <PrimaryButton label="Enter the tower" onPress={handleContinue} disabled={grade === null} />
      </ScrollView>
    </View>
  );
}

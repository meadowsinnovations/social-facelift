import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../data/content';
import { storage } from '../hooks/useStorage';
import MamaBearIcon from '../components/MamaBearIcon';

const { width, height } = Dimensions.get('window');

const FOCUS_OPTIONS = [
  { id: 'encouragement', label: 'Daily Encouragement', emoji: '💌', desc: 'A little boost to start each day' },
  { id: 'faith', label: 'Faith & Hope', emoji: '✨', desc: 'Scripture and spiritual nourishment' },
  { id: 'support', label: 'Emotional Support', emoji: '🤗', desc: 'Someone in your corner, always' },
];

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setStep(s => s + 1);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const handleFinish = async () => {
    if (selected) await storage.setFocusArea(selected);
    await storage.setOnboardingDone();
    navigation.replace('Main');
  };

  const steps = [
    // Step 0: Welcome
    <Animated.View key="welcome" style={[styles.slide, { opacity: fadeAnim }]}>
      <MamaBearIcon size={120} style={styles.bear} />
      <Text style={styles.title}>Welcome to{'\n'}Mama Bear 🐻</Text>
      <Text style={styles.subtitle}>
        A gentle daily companion made just for moms like you.
      </Text>
      <Text style={styles.body}>
        In under 60 seconds each day, find the encouragement, strength, and peace you deserve.
      </Text>
      <TouchableOpacity style={styles.button} onPress={goNext} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Let's get started</Text>
      </TouchableOpacity>
    </Animated.View>,

    // Step 1: What do you need?
    <Animated.View key="focus" style={[styles.slide, { opacity: fadeAnim }]}>
      <Text style={styles.question}>What do you need{'\n'}most right now?</Text>
      <Text style={styles.questionSub}>Choose one — you can always change this later.</Text>
      <View style={styles.optionsContainer}>
        {FOCUS_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.optionCard,
              selected === opt.id && styles.optionCardSelected,
            ]}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.optionEmoji}>{opt.emoji}</Text>
            <View style={styles.optionText}>
              <Text style={[
                styles.optionLabel,
                selected === opt.id && styles.optionLabelSelected,
              ]}>
                {opt.label}
              </Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            {selected === opt.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={selected ? handleFinish : null}
        activeOpacity={selected ? 0.85 : 1}
      >
        <Text style={styles.buttonText}>Enter Mama Bear</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFinish} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </Animated.View>,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blush} />
      <View style={styles.dotsContainer}>
        {[0, 1].map(i => (
          <View
            key={i}
            style={[styles.dot, step === i && styles.dotActive]}
          />
        ))}
      </View>
      {steps[step]}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blush,
    paddingHorizontal: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lavender,
  },
  dotActive: {
    backgroundColor: COLORS.coral,
    width: 24,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  bear: {
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.indigo,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textMid,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: COLORS.textMid,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: COLORS.coral,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  question: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.indigo,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 8,
  },
  questionSub: {
    fontSize: 15,
    color: COLORS.textMid,
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 32,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  optionCardSelected: {
    borderColor: COLORS.coral,
    backgroundColor: '#FFF5F5',
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: COLORS.coral,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.coral,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 16,
    padding: 8,
  },
  skipText: {
    color: COLORS.textLight,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

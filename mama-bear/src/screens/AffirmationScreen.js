import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { COLORS, AFFIRMATIONS, getDailyAffirmation } from '../data/content';

export default function AffirmationScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeechDone, setIsSpeechDone] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const today = getDailyAffirmation();
  const todayIndex = AFFIRMATIONS.indexOf(today);
  const displayIndex = currentIndex;
  const currentAffirmation = AFFIRMATIONS[displayIndex % AFFIRMATIONS.length];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    return () => { Speech.stop(); };
  }, []);

  useEffect(() => {
    let anim;
    if (isPlaying) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      anim.start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(waveAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
    return () => anim?.stop();
  }, [isPlaying]);

  const handlePlay = async () => {
    if (isPlaying) {
      await Speech.stop();
      setIsPlaying(false);
      setIsSpeechDone(false);
      return;
    }

    setIsPlaying(true);
    setIsSpeechDone(false);

    Speech.speak(currentAffirmation, {
      language: 'en-US',
      pitch: 1.05,
      rate: 0.85,
      onDone: () => {
        setIsPlaying(false);
        setIsSpeechDone(true);
      },
      onStopped: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.indigo} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Daily Affirmation 🌟</Text>
            <Text style={styles.subtitle}>Speak this over yourself today</Text>
          </View>

          {/* Play button area */}
          <View style={styles.playerArea}>
            {/* Pulse waves */}
            {isPlaying && (
              <>
                <Animated.View style={[
                  styles.wave,
                  { opacity: waveOpacity, transform: [{ scale: waveScale }] },
                ]} />
                <Animated.View style={[
                  styles.wave,
                  styles.wave2,
                  { opacity: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] }),
                    transform: [{ scale: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }] },
                ]} />
              </>
            )}

            <TouchableOpacity onPress={handlePlay} activeOpacity={0.85}>
              <Animated.View style={[
                styles.playButton,
                { transform: [{ scale: pulseAnim }] },
              ]}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </Animated.View>
            </TouchableOpacity>

            <Text style={styles.playLabel}>
              {isPlaying ? 'Playing...' : isSpeechDone ? 'Play again' : 'Play affirmation'}
            </Text>
          </View>

          {/* Affirmation text card */}
          <View style={styles.affirmationCard}>
            <Text style={styles.quoteMarks}>"</Text>
            <Text style={styles.affirmationText}>{currentAffirmation}</Text>
            <Text style={[styles.quoteMarks, styles.quoteClose]}>"</Text>
          </View>

          {isSpeechDone && (
            <View style={styles.doneMessage}>
              <Text style={styles.doneEmoji}>✨</Text>
              <Text style={styles.doneText}>
                You are seen. You are loved. You are enough.
              </Text>
            </View>
          )}

          {/* Other affirmations */}
          <View style={styles.otherSection}>
            <Text style={styles.otherTitle}>More affirmations</Text>
            {AFFIRMATIONS.map((aff, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.otherCard,
                  displayIndex % AFFIRMATIONS.length === idx && styles.otherCardActive,
                ]}
                onPress={() => {
                  Speech.stop();
                  setIsPlaying(false);
                  setIsSpeechDone(false);
                  setCurrentIndex(idx);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.otherNumber}>{idx + 1}</Text>
                <Text style={styles.otherText} numberOfLines={2}>{aff}</Text>
                {todayIndex === idx && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Today</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.indigo,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.gold,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.lavender,
  },
  playerArea: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.coral,
    opacity: 0.3,
  },
  wave2: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  playButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 12,
  },
  playIcon: {
    fontSize: 36,
    color: COLORS.white,
  },
  playLabel: {
    color: COLORS.lavender,
    fontSize: 14,
    fontWeight: '600',
  },
  affirmationCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quoteMarks: {
    fontSize: 48,
    color: COLORS.gold,
    lineHeight: 40,
    fontWeight: '700',
  },
  quoteClose: {
    textAlign: 'right',
    lineHeight: 10,
  },
  affirmationText: {
    fontSize: 20,
    lineHeight: 32,
    color: COLORS.white,
    fontWeight: '400',
    textAlign: 'center',
    marginVertical: 8,
  },
  doneMessage: {
    backgroundColor: COLORS.blush,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  doneEmoji: {
    fontSize: 24,
  },
  doneText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.indigo,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  otherSection: {
    gap: 10,
  },
  otherTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.lavender,
    marginBottom: 4,
  },
  otherCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  otherCardActive: {
    backgroundColor: 'rgba(255,111,97,0.25)',
    borderColor: COLORS.coral,
  },
  otherNumber: {
    fontSize: 13,
    color: COLORS.lavender,
    width: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  otherText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
  },
  todayBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.indigo,
  },
});

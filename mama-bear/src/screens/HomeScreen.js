import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, MOODS, getDailyEncouragement, getDailyAffirmation, getMoodEncouragement } from '../data/content';
import { storage } from '../hooks/useStorage';
import EncouragementCard from '../components/EncouragementCard';
import MamaBearIcon from '../components/MamaBearIcon';

export default function HomeScreen({ navigation }) {
  const [mood, setMood] = useState(null);
  const [settings, setSettings] = useState({ scriptureEnabled: true });
  const [todayEncouragement, setTodayEncouragement] = useState(getDailyEncouragement());
  const [moodCardVisible, setMoodCardVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [greeting, setGreeting] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [savedMood, savedSettings] = await Promise.all([
      storage.getDailyMood(),
      storage.getSettings(),
    ]);
    setSettings(savedSettings);
    if (savedMood) {
      setMood(savedMood);
      setTodayEncouragement(getMoodEncouragement(savedMood));
      setMoodCardVisible(true);
    } else {
      setMoodCardVisible(false);
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const handleMoodSelect = async (moodId) => {
    setMood(moodId);
    await storage.setDailyMood(moodId);
    const tailored = getMoodEncouragement(moodId);
    setTodayEncouragement(tailored);
    setMoodCardVisible(true);
  };

  const selectedMoodData = MOODS.find(m => m.id === mood);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blush} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.headerTitle}>mama 🐻</Text>
            </View>
            <MamaBearIcon size={56} />
          </View>

          {/* Daily affirmation teaser */}
          <TouchableOpacity
            style={styles.affirmationBanner}
            onPress={() => navigation.navigate('Affirmation')}
            activeOpacity={0.85}
          >
            <Text style={styles.affirmationBannerEmoji}>🌟</Text>
            <View style={styles.affirmationBannerText}>
              <Text style={styles.affirmationBannerLabel}>Today's Affirmation</Text>
              <Text style={styles.affirmationBannerPreview} numberOfLines={1}>
                {getDailyAffirmation().substring(0, 42)}...
              </Text>
            </View>
            <Text style={styles.affirmationBannerArrow}>›</Text>
          </TouchableOpacity>

          {/* Mood Check-In */}
          {!mood ? (
            <View style={styles.moodSection}>
              <Text style={styles.sectionTitle}>How are you feeling today?</Text>
              <View style={styles.moodGrid}>
                {MOODS.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.moodButton, { backgroundColor: m.color + '55' }]}
                    onPress={() => handleMoodSelect(m.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={styles.moodLabel}>{m.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.moodSelectedRow}>
              <Text style={styles.moodSelectedEmoji}>{selectedMoodData?.emoji}</Text>
              <Text style={styles.moodSelectedText}>
                Feeling {selectedMoodData?.label?.toLowerCase()} today
              </Text>
              <TouchableOpacity onPress={() => { setMood(null); storage.setDailyMood(null); }}>
                <Text style={styles.moodChange}>Change</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Today's Encouragement */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {mood ? "Made for you today" : "Today's Encouragement"}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Encouragement')}>
              <Text style={styles.seeAll}>See all ›</Text>
            </TouchableOpacity>
          </View>

          <EncouragementCard
            item={todayEncouragement}
            scriptureEnabled={settings.scriptureEnabled}
          />

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => navigation.navigate('Encouragement')}
              activeOpacity={0.85}
            >
              <Text style={styles.quickActionEmoji}>💌</Text>
              <Text style={styles.quickActionLabel}>More Encouragement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionBtn, { backgroundColor: COLORS.lavender + '33' }]}
              onPress={() => navigation.navigate('Favorites')}
              activeOpacity={0.85}
            >
              <Text style={styles.quickActionEmoji}>❤️</Text>
              <Text style={styles.quickActionLabel}>My Favorites</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blush,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textMid,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.indigo,
  },
  affirmationBanner: {
    backgroundColor: COLORS.indigo,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  affirmationBannerEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  affirmationBannerText: {
    flex: 1,
  },
  affirmationBannerLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  affirmationBannerPreview: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  affirmationBannerArrow: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: '300',
  },
  moodSection: {
    marginBottom: 24,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  moodButton: {
    flex: 1,
    minWidth: '44%',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  moodSelectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodSelectedEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  moodSelectedText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
  },
  moodChange: {
    fontSize: 13,
    color: COLORS.coral,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.indigo,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.coral,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: COLORS.coral + '22',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  quickActionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
  },
});

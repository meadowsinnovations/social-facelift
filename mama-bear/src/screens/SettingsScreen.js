import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../data/content';
import { storage } from '../hooks/useStorage';
import {
  requestNotificationPermissions,
  scheduleMorningNotification,
  scheduleEveningNotification,
  cancelNotification,
} from '../utils/notifications';

const TIME_OPTIONS_MORNING = ['06:00', '07:00', '08:00', '09:00', '10:00'];
const TIME_OPTIONS_EVENING = ['18:00', '19:00', '20:00', '21:00', '22:00'];

const TIME_LABELS = {
  '06:00': '6:00 AM', '07:00': '7:00 AM', '08:00': '8:00 AM',
  '09:00': '9:00 AM', '10:00': '10:00 AM',
  '18:00': '6:00 PM', '19:00': '7:00 PM', '20:00': '8:00 PM',
  '21:00': '9:00 PM', '22:00': '10:00 PM',
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    scriptureEnabled: true,
    morningNotification: true,
    eveningNotification: false,
    morningTime: '08:00',
    eveningTime: '20:00',
  });
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    storage.getSettings().then(setSettings);
  }, []);

  const saveSettings = async (updated) => {
    setSettings(updated);
    await storage.saveSettings(updated);
  };

  const handleToggle = async (key, value) => {
    const updated = { ...settings, [key]: value };

    if (key === 'morningNotification' || key === 'eveningNotification') {
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);

      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive daily encouragements.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (key === 'morningNotification') {
        if (value) {
          await scheduleMorningNotification(updated.morningTime);
        } else {
          await cancelNotification('morning-encouragement');
        }
      }
      if (key === 'eveningNotification') {
        if (value) {
          await scheduleEveningNotification(updated.eveningTime);
        } else {
          await cancelNotification('evening-encouragement');
        }
      }
    }

    await saveSettings(updated);
  };

  const handleTimeChange = async (type, time) => {
    const key = type === 'morning' ? 'morningTime' : 'eveningTime';
    const updated = { ...settings, [key]: time };
    await saveSettings(updated);

    if (type === 'morning' && settings.morningNotification) {
      await scheduleMorningNotification(time);
    }
    if (type === 'evening' && settings.eveningNotification) {
      await scheduleEveningNotification(time);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blush} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings ⚙️</Text>
        </View>

        {/* Content Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Content</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Include Scripture</Text>
                <Text style={styles.settingDesc}>Show Bible verses with encouragements</Text>
              </View>
              <Switch
                value={settings.scriptureEnabled}
                onValueChange={(v) => handleToggle('scriptureEnabled', v)}
                trackColor={{ false: COLORS.textLight, true: COLORS.coral }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Daily Encouragements</Text>
          <View style={styles.card}>
            {/* Morning */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🌅 Morning</Text>
                <Text style={styles.settingDesc}>Start your day with encouragement</Text>
              </View>
              <Switch
                value={settings.morningNotification}
                onValueChange={(v) => handleToggle('morningNotification', v)}
                trackColor={{ false: COLORS.textLight, true: COLORS.coral }}
                thumbColor={COLORS.white}
              />
            </View>

            {settings.morningNotification && (
              <View style={styles.timeSelector}>
                <Text style={styles.timeSelectorLabel}>Send at:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.timeOptions}>
                    {TIME_OPTIONS_MORNING.map(t => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.timeChip,
                          settings.morningTime === t && styles.timeChipActive,
                        ]}
                        onPress={() => handleTimeChange('morning', t)}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.timeChipText,
                          settings.morningTime === t && styles.timeChipTextActive,
                        ]}>
                          {TIME_LABELS[t]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>🌙 Evening</Text>
                <Text style={styles.settingDesc}>Wind down with gentle words</Text>
              </View>
              <Switch
                value={settings.eveningNotification}
                onValueChange={(v) => handleToggle('eveningNotification', v)}
                trackColor={{ false: COLORS.textLight, true: COLORS.coral }}
                thumbColor={COLORS.white}
              />
            </View>

            {settings.eveningNotification && (
              <View style={styles.timeSelector}>
                <Text style={styles.timeSelectorLabel}>Send at:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.timeOptions}>
                    {TIME_OPTIONS_EVENING.map(t => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.timeChip,
                          settings.eveningTime === t && styles.timeChipActive,
                        ]}
                        onPress={() => handleTimeChange('evening', t)}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.timeChipText,
                          settings.eveningTime === t && styles.timeChipTextActive,
                        ]}>
                          {TIME_LABELS[t]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>

          <Text style={styles.notificationNote}>
            Notifications are gentle and never guilt-based. You can turn them off anytime. 🐻
          </Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutEmoji}>🐻</Text>
              <View>
                <Text style={styles.aboutTitle}>Mama Bear</Text>
                <Text style={styles.aboutDesc}>Version 1.0.0 MVP</Text>
              </View>
            </View>
            <Text style={styles.aboutMission}>
              Made with love for every mama who carries more than she shows — and still shows up every single day.
            </Text>
          </View>
        </View>

        {/* Tone reminder */}
        <View style={styles.toneCard}>
          <Text style={styles.toneEmoji}>💌</Text>
          <Text style={styles.toneText}>
            Mama Bear is here to support, never to pressure. Rest is welcome here.
          </Text>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.indigo,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMid,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.softGray,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  timeSelector: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  timeSelectorLabel: {
    fontSize: 12,
    color: COLORS.textMid,
    marginBottom: 8,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.softGray,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeChipActive: {
    backgroundColor: COLORS.coral + '22',
    borderColor: COLORS.coral,
  },
  timeChipText: {
    fontSize: 13,
    color: COLORS.textMid,
    fontWeight: '500',
  },
  timeChipTextActive: {
    color: COLORS.coral,
    fontWeight: '700',
  },
  notificationNote: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softGray,
  },
  aboutEmoji: {
    fontSize: 36,
  },
  aboutTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.indigo,
  },
  aboutDesc: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  aboutMission: {
    padding: 16,
    fontSize: 14,
    color: COLORS.textMid,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  toneCard: {
    backgroundColor: COLORS.indigo,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toneEmoji: {
    fontSize: 28,
  },
  toneText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.lavender,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

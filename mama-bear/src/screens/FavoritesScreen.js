import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, CATEGORIES } from '../data/content';
import { storage } from '../hooks/useStorage';
import EncouragementCard from '../components/EncouragementCard';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [scriptureEnabled, setScriptureEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    const [favs, settings] = await Promise.all([
      storage.getFavorites(),
      storage.getSettings(),
    ]);
    setFavorites(favs);
    setScriptureEnabled(settings.scriptureEnabled);
    setLoading(false);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleRemove = async (id) => {
    const updated = await storage.removeFavorite(id);
    setFavorites(updated);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blush} />

      <View style={styles.header}>
        <Text style={styles.title}>My Encouragements ❤️</Text>
        <Text style={styles.subtitle}>
          {favorites.length === 0
            ? 'Save messages that speak to your heart'
            : `${favorites.length} saved message${favorites.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyBody}>
            When an encouragement speaks to you, tap the heart to save it here. Come back anytime you need a reminder.
          </Text>
          <Text style={styles.emptyHint}>
            Go to Encouragement and tap 🤍 on any card
          </Text>
        </Animated.View>
      ) : (
        <Animated.ScrollView
          style={{ opacity: fadeAnim }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {favorites.map((item, index) => (
            <View key={item.id} style={styles.cardContainer}>
              <EncouragementCard
                item={item}
                scriptureEnabled={scriptureEnabled}
                onSave={() => handleRemove(item.id)}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blush,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.indigo,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMid,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  cardContainer: {
    gap: 6,
  },
  removeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.indigo,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    color: COLORS.textMid,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textMid,
  },
});

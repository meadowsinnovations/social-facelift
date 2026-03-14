import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, ENCOURAGEMENTS, CATEGORIES } from '../data/content';
import { storage } from '../hooks/useStorage';
import EncouragementCard from '../components/EncouragementCard';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.28;

const ALL_CATEGORY = { label: 'All', color: COLORS.coral, emoji: '💌' };

export default function EncouragementScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [scriptureEnabled, setScriptureEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    storage.getSettings().then(s => setScriptureEnabled(s.scriptureEnabled));
  }, []);

  const filteredCards = activeCategory === 'all'
    ? ENCOURAGEMENTS
    : ENCOURAGEMENTS.filter(e => e.category === activeCategory);

  const currentCard = filteredCards[currentIndex % filteredCards.length];
  const nextCard = filteredCards[(currentIndex + 1) % filteredCards.length];

  const resetCard = () => {
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
    cardOpacity.setValue(1);
  };

  const swipeCard = (direction) => {
    const toValue = direction === 'right' ? width * 1.5 : -width * 1.5;
    Animated.parallel([
      Animated.timing(translateX, { toValue, duration: 280, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setSaved(false);
      setCurrentIndex(i => i + 1);
      resetCard();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderMove: (_, { dx, dy }) => {
        translateX.setValue(dx);
        translateY.setValue(dy * 0.3);
        rotate.setValue(dx / width * 18);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          swipeCard(dx > 0 ? 'right' : 'left');
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
          Animated.spring(rotate, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const rotateStr = rotate.interpolate({
    inputRange: [-30, 0, 30],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const categories = [
    ['all', ALL_CATEGORY],
    ...Object.entries(CATEGORIES),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blush} />

      <View style={styles.header}>
        <Text style={styles.title}>Encouragement 💌</Text>
        <Text style={styles.subtitle}>Swipe to explore • Tap heart to save</Text>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(([key, cat]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryChip,
              activeCategory === key && { backgroundColor: cat.color + 'CC' },
            ]}
            onPress={() => { setActiveCategory(key); setCurrentIndex(0); }}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
            <Text style={[
              styles.categoryChipLabel,
              activeCategory === key && styles.categoryChipLabelActive,
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cards stack */}
      <View style={styles.cardsContainer}>
        {/* Background card (next) */}
        <View style={[styles.cardWrapper, styles.cardBack]}>
          <EncouragementCard
            item={nextCard}
            scriptureEnabled={scriptureEnabled}
            showSaveButton={false}
          />
        </View>

        {/* Foreground card (current) */}
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              opacity: cardOpacity,
              transform: [
                { translateX },
                { translateY },
                { rotate: rotateStr },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <EncouragementCard
            item={currentCard}
            scriptureEnabled={scriptureEnabled}
            onSave={() => setSaved(true)}
          />
        </Animated.View>
      </View>

      {/* Swipe hint */}
      <View style={styles.swipeHint}>
        <Text style={styles.swipeArrow}>‹</Text>
        <Text style={styles.swipeHintText}>Swipe to browse</Text>
        <Text style={styles.swipeArrow}>›</Text>
      </View>

      {/* Scripture toggle */}
      <View style={styles.scriptureToggle}>
        <Text style={styles.scriptureLabel}>Include scripture</Text>
        <TouchableOpacity
          style={[styles.toggle, scriptureEnabled && styles.toggleOn]}
          onPress={async () => {
            const newVal = !scriptureEnabled;
            setScriptureEnabled(newVal);
            const s = await storage.getSettings();
            await storage.saveSettings({ ...s, scriptureEnabled: newVal });
          }}
          activeOpacity={0.85}
        >
          <View style={[styles.toggleThumb, scriptureEnabled && styles.toggleThumbOn]} />
        </TouchableOpacity>
      </View>

      {/* Count indicator */}
      <Text style={styles.counter}>
        {(currentIndex % filteredCards.length) + 1} of {filteredCards.length}
      </Text>
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.indigo,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMid,
    marginTop: 2,
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
    gap: 4,
  },
  categoryChipEmoji: {
    fontSize: 14,
  },
  categoryChipLabel: {
    fontSize: 13,
    color: COLORS.textMid,
    fontWeight: '500',
  },
  categoryChipLabelActive: {
    color: COLORS.indigo,
    fontWeight: '700',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
  },
  cardBack: {
    transform: [{ scale: 0.95 }, { translateY: 8 }],
    opacity: 0.75,
  },
  swipeHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  swipeArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  swipeHintText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  scriptureToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  scriptureLabel: {
    fontSize: 14,
    color: COLORS.textMid,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.textLight,
    justifyContent: 'center',
    padding: 3,
  },
  toggleOn: {
    backgroundColor: COLORS.coral,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  counter: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    paddingBottom: 12,
  },
});

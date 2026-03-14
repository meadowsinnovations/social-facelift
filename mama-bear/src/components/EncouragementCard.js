import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, CATEGORIES } from '../data/content';
import { storage } from '../hooks/useStorage';

export default function EncouragementCard({
  item,
  scriptureEnabled = true,
  onSave,
  showSaveButton = true,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [saveAnim] = useState(new Animated.Value(1));

  const category = CATEGORIES[item.category] || CATEGORIES.motherhood;

  useEffect(() => {
    storage.isFavorite(item.id).then(setIsFavorite);
  }, [item.id]);

  const handleSave = async () => {
    Animated.sequence([
      Animated.timing(saveAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(saveAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    if (isFavorite) {
      await storage.removeFavorite(item.id);
      setIsFavorite(false);
    } else {
      await storage.saveFavorite(item);
      setIsFavorite(true);
    }
    onSave?.();
  };

  return (
    <View style={[styles.card, { borderTopColor: category.color }]}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        <Text style={[styles.categoryLabel, { color: COLORS.indigo }]}>
          {category.label}
        </Text>
      </View>

      <Text style={styles.message}>{item.text}</Text>

      {scriptureEnabled && item.scripture && (
        <View style={styles.scriptureBox}>
          <Text style={styles.scriptureText}>{item.scripture}</Text>
        </View>
      )}

      {showSaveButton && (
        <TouchableOpacity onPress={handleSave} style={styles.saveRow}>
          <Animated.Text
            style={[styles.saveIcon, { transform: [{ scale: saveAnim }] }]}
          >
            {isFavorite ? '❤️' : '🤍'}
          </Animated.Text>
          <Text style={styles.saveLabel}>
            {isFavorite ? 'Saved to favorites' : 'Save this'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
    borderTopWidth: 4,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textDark,
    fontWeight: '400',
    marginBottom: 20,
  },
  scriptureBox: {
    backgroundColor: COLORS.blush,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  scriptureText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.indigo,
    fontStyle: 'italic',
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.softGray,
  },
  saveIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  saveLabel: {
    fontSize: 14,
    color: COLORS.textMid,
  },
});

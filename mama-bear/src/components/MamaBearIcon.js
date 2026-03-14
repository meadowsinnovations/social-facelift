import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../data/content';

// SVG-based bear face component (no external image needed for MVP)
export default function MamaBearIcon({ size = 80, style }) {
  const scale = size / 80;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* Bear body/head */}
      <View style={[styles.head, { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.425 }]}>
        {/* Ears */}
        <View style={[styles.earLeft, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, top: size * 0.04, left: size * 0.04 }]} />
        <View style={[styles.earRight, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, top: size * 0.04, right: size * 0.04 }]} />
        {/* Inner ears */}
        <View style={[styles.innerEarLeft, { width: size * 0.16, height: size * 0.16, borderRadius: size * 0.08, top: size * 0.09, left: size * 0.1 }]} />
        <View style={[styles.innerEarRight, { width: size * 0.16, height: size * 0.16, borderRadius: size * 0.08, top: size * 0.09, right: size * 0.1 }]} />
        {/* Face */}
        <View style={[styles.face, { width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, top: size * 0.1, left: size * 0.075 }]}>
          {/* Eyes */}
          <View style={[styles.eye, { width: size * 0.1, height: size * 0.1, borderRadius: size * 0.05, top: size * 0.18, left: size * 0.14 }]} />
          <View style={[styles.eye, { width: size * 0.1, height: size * 0.1, borderRadius: size * 0.05, top: size * 0.18, right: size * 0.14 }]} />
          {/* Eye shine */}
          <View style={[styles.eyeShine, { width: size * 0.035, height: size * 0.035, borderRadius: size * 0.018, top: size * 0.17, left: size * 0.165 }]} />
          <View style={[styles.eyeShine, { width: size * 0.035, height: size * 0.035, borderRadius: size * 0.018, top: size * 0.17, right: size * 0.165 }]} />
          {/* Snout */}
          <View style={[styles.snout, { width: size * 0.34, height: size * 0.22, borderRadius: size * 0.11, top: size * 0.35, left: size * 0.18 }]}>
            {/* Nose */}
            <View style={[styles.nose, { width: size * 0.12, height: size * 0.08, borderRadius: size * 0.04, top: size * 0.02 }]} />
            {/* Smile */}
            <Text style={[styles.smile, { fontSize: size * 0.1, top: size * 0.1 }]}>‿</Text>
          </View>
        </View>
      </View>
      {/* Heart */}
      <Text style={[styles.heart, { fontSize: size * 0.22, bottom: 0, right: 0 }]}>❤️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    backgroundColor: '#8B6F47',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earLeft: {
    backgroundColor: '#8B6F47',
    position: 'absolute',
    zIndex: 0,
  },
  earRight: {
    backgroundColor: '#8B6F47',
    position: 'absolute',
    zIndex: 0,
  },
  innerEarLeft: {
    backgroundColor: '#C49A6C',
    position: 'absolute',
    zIndex: 1,
  },
  innerEarRight: {
    backgroundColor: '#C49A6C',
    position: 'absolute',
    zIndex: 1,
  },
  face: {
    backgroundColor: '#A07850',
    position: 'absolute',
    zIndex: 2,
  },
  eye: {
    backgroundColor: '#2D2D2D',
    position: 'absolute',
    zIndex: 3,
  },
  eyeShine: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    zIndex: 4,
  },
  snout: {
    backgroundColor: '#C49A6C',
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
  },
  nose: {
    backgroundColor: '#2D2D2D',
    alignSelf: 'center',
  },
  smile: {
    color: '#2D2D2D',
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  heart: {
    position: 'absolute',
    zIndex: 5,
  },
});

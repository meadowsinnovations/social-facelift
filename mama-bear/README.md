# 🐻 Mama Bear

> A gentle daily companion for moms. Encouragement, affirmations, and emotional support in under 60 seconds a day.

## MVP Features

- **Daily Encouragement** — Swipeable cards by category (Faith, Motherhood, Strength, Rest) with optional scripture
- **Daily Affirmation** — Read + text-to-speech playback
- **Mood Check-In** — Select how you're feeling → receive tailored encouragement
- **Push Notifications** — Morning/evening encouragements (gentle, never guilt-based)
- **Favorites** — Save and revisit messages that speak to your heart

## Tech Stack

- **Expo** (React Native) — cross-platform iOS & Android
- **React Navigation** — bottom tabs + native stack
- **AsyncStorage** — local favorites, settings, and mood data
- **expo-speech** — text-to-speech affirmations
- **expo-notifications** — scheduled push notifications
- **Firebase** — backend (Firestore) for future content management

## Project Structure

```
mama-bear/
├── App.js                      # Entry point
├── app.json                    # Expo config
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.js  # 2-step welcome + focus selection
│   │   ├── HomeScreen.js        # Dashboard with mood check-in
│   │   ├── EncouragementScreen.js  # Swipeable card browser
│   │   ├── AffirmationScreen.js    # TTS affirmation player
│   │   ├── FavoritesScreen.js      # Saved encouragements
│   │   └── SettingsScreen.js       # Notifications + preferences
│   ├── components/
│   │   ├── EncouragementCard.js    # Reusable card component
│   │   └── MamaBearIcon.js         # Bear mascot (no image needed)
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── data/
│   │   └── content.js              # All encouragements + affirmations
│   ├── hooks/
│   │   └── useStorage.js           # AsyncStorage abstraction
│   ├── utils/
│   │   └── notifications.js        # Push notification helpers
│   └── firebase/
│       └── config.js               # Firebase init
```

## Design System

| Color | Hex | Use |
|-------|-----|-----|
| Soft Blush | `#FADADD` | Background |
| Coral | `#FF6F61` | Primary CTA |
| Lavender | `#C7B8EA` | Accents |
| Indigo | `#3F4E76` | Text, dark screens |
| Gold | `#EBC73E` | Highlights |

## Getting Started

```bash
cd mama-bear
npm install
cp .env.example .env   # Add your Firebase credentials
npx expo start
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add an Android/iOS app to the project
3. Copy credentials to `.env` (see `.env.example`)
4. Enable Firestore Database
5. For Android push notifications, download `google-services.json` → place in `mama-bear/`

## Building for Production

```bash
npx eas build --platform all
npx eas submit
```

---

*Built for moms who carry more than most people realize — and still show up every day.* 🐻❤️

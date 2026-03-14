import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { storage } from './src/hooks/useStorage';
import { requestNotificationPermissions } from './src/utils/notifications';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    initialize();
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const initialize = async () => {
    try {
      const [onboardingDone] = await Promise.all([
        storage.isOnboardingDone(),
      ]);
      setIsOnboardingDone(onboardingDone);

      // Set up notification listeners
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // Notification received while app is open
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        // User tapped notification — app opens to home
      });

      // Request notification permission on first load if onboarding done
      if (onboardingDone) {
        requestNotificationPermissions().catch(() => {});
      }
    } catch (e) {
      console.warn('Init error:', e);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppNavigator isOnboardingDone={isOnboardingDone} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

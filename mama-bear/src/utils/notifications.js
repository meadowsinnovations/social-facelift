import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('mama-bear', {
      name: 'Mama Bear Encouragements',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6F61',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleMorningNotification(timeString = '08:00') {
  await Notifications.cancelScheduledNotificationAsync('morning-encouragement').catch(() => {});

  const [hour, minute] = timeString.split(':').map(Number);

  const messages = [
    { title: '🐻 Good morning, mama!', body: "A new day, a fresh start. You've got this." },
    { title: '🐻 Rise and shine!', body: "Today's encouragement is waiting for you." },
    { title: '🐻 Morning, beautiful!', body: "Start your day with a little love — just for you." },
    { title: '🐻 Hey, mama!', body: "You are loved and seen. Open today's message." },
  ];

  const msg = messages[Math.floor(Math.random() * messages.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: 'morning-encouragement',
    content: {
      title: msg.title,
      body: msg.body,
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function scheduleEveningNotification(timeString = '20:00') {
  await Notifications.cancelScheduledNotificationAsync('evening-encouragement').catch(() => {});

  const [hour, minute] = timeString.split(':').map(Number);

  const messages = [
    { title: '🌙 End of day, mama.', body: "You made it through today. That's worth celebrating." },
    { title: '🌙 You did it.', body: "Another day of love, patience, and showing up." },
    { title: '🌙 Rest well tonight.', body: "You gave so much today. Your love was enough." },
  ];

  const msg = messages[Math.floor(Math.random() * messages.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: 'evening-encouragement',
    content: {
      title: msg.title,
      body: msg.body,
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function cancelNotification(identifier) {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
}

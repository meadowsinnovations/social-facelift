import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@mama_bear_favorites',
  SETTINGS: '@mama_bear_settings',
  ONBOARDING_DONE: '@mama_bear_onboarding_done',
  DAILY_MOOD: '@mama_bear_daily_mood',
  FOCUS_AREA: '@mama_bear_focus_area',
};

export const storage = {
  async getFavorites() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveFavorite(item) {
    try {
      const current = await this.getFavorites();
      const exists = current.find(f => f.id === item.id);
      if (exists) return current;
      const updated = [item, ...current];
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  async removeFavorite(id) {
    try {
      const current = await this.getFavorites();
      const updated = current.filter(f => f.id !== id);
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  async isFavorite(id) {
    try {
      const favs = await this.getFavorites();
      return favs.some(f => f.id === id);
    } catch {
      return false;
    }
  },

  async getSettings() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
      return raw
        ? JSON.parse(raw)
        : {
            scriptureEnabled: true,
            morningNotification: true,
            eveningNotification: false,
            morningTime: '08:00',
            eveningTime: '20:00',
          };
    } catch {
      return {
        scriptureEnabled: true,
        morningNotification: true,
        eveningNotification: false,
        morningTime: '08:00',
        eveningTime: '20:00',
      };
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  async isOnboardingDone() {
    try {
      const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setOnboardingDone() {
    try {
      await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
    } catch {}
  },

  async getDailyMood() {
    try {
      const raw = await AsyncStorage.getItem(KEYS.DAILY_MOOD);
      if (!raw) return null;
      const { mood, date } = JSON.parse(raw);
      const today = new Date().toDateString();
      return date === today ? mood : null;
    } catch {
      return null;
    }
  },

  async setDailyMood(mood) {
    try {
      await AsyncStorage.setItem(
        KEYS.DAILY_MOOD,
        JSON.stringify({ mood, date: new Date().toDateString() })
      );
    } catch {}
  },

  async getFocusArea() {
    try {
      return await AsyncStorage.getItem(KEYS.FOCUS_AREA);
    } catch {
      return null;
    }
  },

  async setFocusArea(area) {
    try {
      await AsyncStorage.setItem(KEYS.FOCUS_AREA, area);
    } catch {}
  },
};

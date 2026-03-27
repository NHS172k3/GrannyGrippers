import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserPreferences } from '../types';

const PREFS_KEY = 'gg_preferences';

interface PreferencesState extends UserPreferences {
  loaded: boolean;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  loadPreferences: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  autoReconnect: true,
  hapticFeedback: true,
  sessionReminders: false,
  loaded: false,

  setPreference: (key, value) => {
    set({ [key]: value });
    const { autoReconnect, hapticFeedback, sessionReminders } = { ...get(), [key]: value };
    AsyncStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ autoReconnect, hapticFeedback, sessionReminders })
    ).catch(() => {});
  },

  loadPreferences: async () => {
    try {
      const raw = await AsyncStorage.getItem(PREFS_KEY);
      if (raw) {
        const prefs = JSON.parse(raw) as UserPreferences;
        set({ ...prefs, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },
}));

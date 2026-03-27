import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '../types';

const SESSIONS_KEY = 'gg_sessions';
const LAST_DEVICE_KEY = 'gg_last_device_id';
const ONBOARDED_KEY = 'gg_onboarded';

export async function loadSessions(): Promise<Session[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.error('[Storage] Failed to load sessions');
    return [];
  }
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    console.error('[Storage] Failed to save sessions');
  }
}

export async function clearSessions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSIONS_KEY);
  } catch {
    console.error('[Storage] Failed to clear sessions');
  }
}

export async function getLastDeviceId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_DEVICE_KEY);
  } catch {
    return null;
  }
}

export async function setLastDeviceId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_DEVICE_KEY, id);
  } catch {
    console.error('[Storage] Failed to save device ID');
  }
}

export async function clearLastDeviceId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LAST_DEVICE_KEY);
  } catch {
    console.error('[Storage] Failed to clear device ID');
  }
}

export async function isOnboarded(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDED_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function setOnboarded(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDED_KEY, value ? '1' : '0');
  } catch {
    console.error('[Storage] Failed to set onboarding state');
  }
}

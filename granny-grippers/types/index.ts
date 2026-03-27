export type SpeedLevel = 'LOW' | 'MED' | 'HIGH';
export type ModeType = 'SCRUB' | 'MASSAGE' | 'RINSE';
export type ConnectionState = 'disconnected' | 'scanning' | 'connecting' | 'connected';
export type ColorVariant = 'success' | 'danger' | 'warning' | 'brand' | 'neutral';

export interface Session {
  id: string;
  startedAt: string;
  durationSeconds: number;
  mode: ModeType | null;
  speed: SpeedLevel | null;
  pumpUsed: boolean;
}

export interface DeviceStatus {
  isRunning: boolean;
  speed: SpeedLevel | null;
  mode: ModeType | null;
  pumpActive: boolean;
  batteryLevel: number | null;
}

export interface ButtonDef {
  id: string;
  label: string;
  icon: string;
  command: string;
  colorVariant: ColorVariant;
  section: 'power' | 'mode' | 'speed' | 'pump';
  isToggle?: boolean;
}

export interface UserPreferences {
  autoReconnect: boolean;
  hapticFeedback: boolean;
  sessionReminders: boolean;
}

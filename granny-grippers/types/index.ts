export type MotorSpeed = 'OFF' | 'LOW' | 'MED' | 'HIGH';
export type ConnectionState = 'disconnected' | 'scanning' | 'connecting' | 'connected';
export type ColorVariant = 'success' | 'danger' | 'warning' | 'brand' | 'neutral';

// Maps internal MotorSpeed values to consumer-friendly display strings
export const SPEED_DISPLAY: Record<string, string> = {
  OFF:  'Off',
  LOW:  'Gentle',
  MED:  'Standard',
  HIGH: 'Power',
};

export interface Session {
  id: string;
  startedAt: string;
  durationSeconds: number;
  mainSpeed: MotorSpeed | null;
  heelSpeed: MotorSpeed | null;
  pumpUsed: boolean;
}

export interface DeviceStatus {
  mainSpeed: MotorSpeed | null;
  heelSpeed: MotorSpeed | null;
  pumpActive: boolean;
  batteryLevel: number | null;
}

export interface ButtonDef {
  id: string;
  label: string;
  icon: string;
  command: string;
  colorVariant: ColorVariant;
  section: 'power' | 'program' | 'sole' | 'heel' | 'pump';
  isToggle?: boolean;
}

export interface UserPreferences {
  autoReconnect: boolean;
  hapticFeedback: boolean;
  sessionReminders: boolean;
}

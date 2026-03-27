import { COMMANDS } from './ble';
import type { ButtonDef } from '../types';

export const CONTROL_BUTTONS: ButtonDef[] = [
  { id: 'start', label: 'Start', icon: 'play-circle', command: COMMANDS.START, colorVariant: 'success', section: 'power' },
  { id: 'pause', label: 'Pause', icon: 'pause-circle', command: COMMANDS.PAUSE, colorVariant: 'warning', section: 'power' },
  { id: 'stop', label: 'Stop', icon: 'stop-circle', command: COMMANDS.STOP, colorVariant: 'danger', section: 'power' },
  { id: 'mode_scrub', label: 'Scrub', icon: 'brush', command: COMMANDS.MODE_SCRUB, colorVariant: 'brand', section: 'mode', isToggle: true },
  { id: 'mode_massage', label: 'Massage', icon: 'sparkles', command: COMMANDS.MODE_MASSAGE, colorVariant: 'brand', section: 'mode', isToggle: true },
  { id: 'mode_rinse', label: 'Rinse', icon: 'water', command: COMMANDS.MODE_RINSE, colorVariant: 'brand', section: 'mode', isToggle: true },
  { id: 'speed_low', label: 'Low', icon: 'speedometer-outline', command: COMMANDS.SPEED_LOW, colorVariant: 'neutral', section: 'speed', isToggle: true },
  { id: 'speed_medium', label: 'Med', icon: 'speedometer-outline', command: COMMANDS.SPEED_MEDIUM, colorVariant: 'neutral', section: 'speed', isToggle: true },
  { id: 'speed_high', label: 'High', icon: 'speedometer', command: COMMANDS.SPEED_HIGH, colorVariant: 'neutral', section: 'speed', isToggle: true },
  { id: 'pump_on', label: 'Pump On', icon: 'water-outline', command: COMMANDS.PUMP_ON, colorVariant: 'brand', section: 'pump', isToggle: true },
  { id: 'pump_off', label: 'Pump Off', icon: 'water-outline', command: COMMANDS.PUMP_OFF, colorVariant: 'neutral', section: 'pump', isToggle: true },
];

export const BUTTON_SECTIONS = ['power', 'mode', 'speed', 'pump'] as const;

export function getButtonsBySection(section: string): ButtonDef[] {
  return CONTROL_BUTTONS.filter((b) => b.section === section);
}

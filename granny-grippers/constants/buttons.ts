import { COMMANDS } from './ble';
import type { ButtonDef } from '../types';

export const CONTROL_BUTTONS: ButtonDef[] = [
  // ── Programs — one-tap presets ───────────────────────────────────────────
  { id: 'prog_deepclean', label: 'Deep Clean', icon: 'sparkles',      command: COMMANDS.MODE_SCRUB,    colorVariant: 'brand',   section: 'program' },
  { id: 'prog_massage',   label: 'Massage',    icon: 'heart-outline',  command: COMMANDS.MODE_MASSAGE,  colorVariant: 'success', section: 'program' },
  { id: 'prog_rinse',     label: 'Rinse',      icon: 'water',          command: COMMANDS.MODE_RINSE,    colorVariant: 'brand',   section: 'program' },

  // ── Power ────────────────────────────────────────────────────────────────
  { id: 'start',          label: 'Start',      icon: 'play-circle',    command: COMMANDS.START,         colorVariant: 'success', section: 'power' },
  { id: 'stop',           label: 'Stop All',   icon: 'stop-circle',    command: COMMANDS.STOP,          colorVariant: 'danger',  section: 'power' },

  // ── Sole (top/base of foot) ───────────────────────────────────────────────
  { id: 'sole_off',       label: 'Off',        icon: 'power-outline',          command: COMMANDS.SOLE_OFF,      colorVariant: 'neutral', section: 'sole', isToggle: true },
  { id: 'sole_gentle',    label: 'Gentle',     icon: 'leaf-outline',           command: COMMANDS.SOLE_GENTLE,   colorVariant: 'brand',   section: 'sole', isToggle: true },
  { id: 'sole_standard',  label: 'Standard',   icon: 'radio-button-on-outline',command: COMMANDS.SOLE_STANDARD, colorVariant: 'brand',   section: 'sole', isToggle: true },
  { id: 'sole_power',     label: 'Power',      icon: 'flash-outline',          command: COMMANDS.SOLE_POWER,    colorVariant: 'warning', section: 'sole', isToggle: true },

  // ── Heel (back of foot) ───────────────────────────────────────────────────
  { id: 'heel_off',       label: 'Off',        icon: 'power-outline',          command: COMMANDS.HEEL_OFF,      colorVariant: 'neutral', section: 'heel', isToggle: true },
  { id: 'heel_gentle',    label: 'Gentle',     icon: 'leaf-outline',           command: COMMANDS.HEEL_GENTLE,   colorVariant: 'brand',   section: 'heel', isToggle: true },
  { id: 'heel_standard',  label: 'Standard',   icon: 'radio-button-on-outline',command: COMMANDS.HEEL_STANDARD, colorVariant: 'brand',   section: 'heel', isToggle: true },
  { id: 'heel_power',     label: 'Power',      icon: 'flash-outline',          command: COMMANDS.HEEL_POWER,    colorVariant: 'warning', section: 'heel', isToggle: true },

  // ── Pump ─────────────────────────────────────────────────────────────────
  { id: 'pump_on',        label: 'Pump On',    icon: 'water',          command: COMMANDS.PUMP_ON,       colorVariant: 'brand',   section: 'pump', isToggle: true },
  { id: 'pump_off',       label: 'Pump Off',   icon: 'water-outline',  command: COMMANDS.PUMP_OFF,      colorVariant: 'neutral', section: 'pump', isToggle: true },
];

export const BUTTON_SECTIONS = ['program', 'power', 'sole', 'heel', 'pump'] as const;

export function getButtonsBySection(section: string): ButtonDef[] {
  return CONTROL_BUTTONS.filter((b) => b.section === section);
}

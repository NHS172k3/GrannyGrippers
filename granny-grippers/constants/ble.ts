export const BLE_CONFIG = {
  SERVICE_UUID: '12345678-1234-1234-1234-123456789abc',
  CHARACTERISTIC_UUID_TX: '12345678-1234-1234-1234-123456789abd',
  CHARACTERISTIC_UUID_RX: '12345678-1234-1234-1234-123456789abe',
  DEVICE_NAME_PREFIX: 'GrannyGrippers',
  SCAN_TIMEOUT_MS: 10000,
  RECONNECT_DELAY_MS: 3000,
  COMMAND_DEBOUNCE_MS: 100,
  MAX_RECONNECT_RETRIES: 3,
} as const;

export const COMMANDS = {
  // Global
  START: 'CMD:START',
  STOP:  'CMD:STOP',

  // One-tap program presets
  MODE_SCRUB:   'CMD:MODE:SCRUB',    // Deep Clean  → Sole: Power, Heel: Power
  MODE_MASSAGE: 'CMD:MODE:MASSAGE',  // Massage     → Sole: Gentle, Heel: Gentle
  MODE_RINSE:   'CMD:MODE:RINSE',    // Rinse       → Sole: Gentle, Heel: Off

  // Sole (main motor) per-speed
  SOLE_OFF:     'CMD:MAIN:OFF',
  SOLE_GENTLE:  'CMD:MAIN:LOW',
  SOLE_STANDARD:'CMD:MAIN:MED',
  SOLE_POWER:   'CMD:MAIN:HIGH',

  // Heel (heel motor) per-speed
  HEEL_OFF:     'CMD:HEEL:OFF',
  HEEL_GENTLE:  'CMD:HEEL:LOW',
  HEEL_STANDARD:'CMD:HEEL:MED',
  HEEL_POWER:   'CMD:HEEL:HIGH',

  // Pump
  PUMP_ON:  'CMD:PUMP:ON',
  PUMP_OFF: 'CMD:PUMP:OFF',

  STATUS: 'CMD:STATUS',
} as const;

export type Command = (typeof COMMANDS)[keyof typeof COMMANDS];

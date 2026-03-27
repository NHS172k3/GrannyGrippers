# CLAUDE.md — Granny Grippers App

## Project Overview

**Granny Grippers** is a consumer mobile app (iOS & Android) that controls a smart foot cleaner via Bluetooth Low Energy (BLE). The app sends BLE commands to an ESP32 microcontroller embedded in the device.

The app is a **full smart appliance companion app** — modelled after premium IoT product apps like Dyson, Philips Hue, or Xiaomi Home. It has four tabs: Home (dashboard), Control, History, and Settings. The Control tab contains the button grid that sends commands to the ESP32.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Expo (SDK 52+)** with React Native | Cross-platform, fast iteration, OTA updates |
| Fonts | **expo-font** + **@expo-google-fonts/nunito** | Custom typography |
| Language | **TypeScript** (strict mode) | Type safety for BLE payloads and state |
| BLE | **react-native-ble-plx** | Best-maintained RN BLE library, works with Expo via dev client |
| State | **Zustand** | Lightweight, modular, perfect for BLE + session state |
| Navigation | **Expo Router** (file-based) | Clean tab routing, scalable |
| Styling | **NativeWind v4** (Tailwind for RN) | Utility-first, fast UI iteration |
| Icons | **@expo/vector-icons** (Ionicons) | Built into Expo |
| Haptics | **expo-haptics** | Tactile feedback on button press |
| Animations | **react-native-reanimated v3** | Smooth button press / connection status animations |
| Storage | **@react-native-async-storage/async-storage** | Persist last paired device ID, session history |
| Charts | **victory-native** | Session history bar charts on History tab |

---

## Project Structure

Scaffold this exact folder structure:

```
granny-grippers/
├── app/
│   ├── _layout.tsx                  # Root layout — BleProvider wraps everything
│   ├── index.tsx                    # Splash / onboarding (first launch only)
│   └── (tabs)/
│       ├── _layout.tsx              # Tab bar layout (4 tabs)
│       ├── home.tsx                 # Dashboard — device status, quick actions, recent sessions
│       ├── control.tsx              # Control panel — button grid sends BLE commands
│       ├── history.tsx              # Session log — chart + list of past sessions
│       └── settings.tsx             # BLE pairing, preferences, firmware info
│
├── components/
│   ├── ble/
│   │   ├── BleProvider.tsx          # BLE singleton + scanning logic, wraps app root
│   │   └── DeviceScanner.tsx        # Modal: scan, list, connect to Granny Grippers device
│   ├── home/
│   │   ├── DeviceCard.tsx           # Hero card: device name, firmware, connection status
│   │   ├── QuickActions.tsx         # Start / Pause / Stop shortcut buttons
│   │   └── RecentSessionsList.tsx   # Last 3 sessions preview
│   ├── control/
│   │   ├── ControlButton.tsx        # Single action button (animated, haptic, BLE-connected)
│   │   ├── ControlGrid.tsx          # Sectioned grid: Power, Mode, Speed, Pump
│   │   └── ActiveStatusStrip.tsx    # Live status bar: current mode, speed, elapsed time
│   ├── history/
│   │   ├── WeeklySummaryCard.tsx    # Session count + avg duration this week
│   │   ├── SessionBarChart.tsx      # Victory-native bar chart: sessions per day
│   │   └── SessionLogList.tsx       # Scrollable list of all past sessions
│   ├── settings/
│   │   ├── DeviceInfoCard.tsx       # Paired device info + RSSI signal strength
│   │   ├── PreferencesCard.tsx      # Toggle switches: auto-reconnect, haptics, reminders
│   │   └── DangerZoneCard.tsx       # Forget device, reset settings
│   └── ui/
│       ├── ConnectionBadge.tsx      # Pill: "● Connected" / "○ Disconnected" with color
│       ├── GGHeader.tsx             # Shared header: title + connection badge
│       ├── SectionHeader.tsx        # Muted uppercase section label
│       └── Card.tsx                 # Base card container with consistent border/radius/padding
│
├── constants/
│   ├── ble.ts                       # UUIDs, command strings, scan timeout
│   ├── buttons.ts                   # Button definitions: label, icon, command, colorVariant
│   └── theme.ts                     # Color tokens, spacing, border radius
│
├── hooks/
│   ├── useBle.ts                    # Access BLE store: device, connection state, actions
│   ├── useDeviceCommands.ts         # Send typed commands to ESP32 via BLE write
│   └── useSessions.ts              # Load, save, query session history from AsyncStorage
│
├── types/
│   └── index.ts                     # All shared TypeScript interfaces and types
│
├── utils/
│   ├── sessionStorage.ts            # AsyncStorage helpers: read/write session history
│   └── bleHelpers.ts                # Base64 encode/decode for BLE writes
│
├── assets/
│   ├── images/logo.png
│   └── fonts/
│
├── stores/
│   ├── bleStore.ts                  # Zustand: BleManager singleton, device, connection, status
│   ├── sessionStore.ts             # Zustand: current session timer, session log
│   └── preferencesStore.ts         # Zustand: user preferences (auto-reconnect, haptics, reminders)
│
├── app.json
├── babel.config.js
├── metro.config.js                  # Metro bundler config with NativeWind wrapper
├── tailwind.config.js
├── global.css                       # Tailwind CSS directives (@tailwind base/components/utilities)
├── nativewind-env.d.ts             # TypeScript types for NativeWind className prop
├── tsconfig.json
└── package.json
```

---

## Initial Setup Commands

```bash
npx create-expo-app@latest granny-grippers --template blank-typescript
cd granny-grippers

# Expo Router + navigation dependencies
npx expo install expo-router expo-constants expo-linking expo-status-bar react-native-safe-area-context react-native-screens expo-splash-screen expo-system-ui

# BLE (requires dev client — does NOT work in Expo Go)
npx expo install react-native-ble-plx

# State
npm install zustand

# Storage
npx expo install @react-native-async-storage/async-storage

# Styling — IMPORTANT: pin tailwindcss to v3 (NativeWind v4 is incompatible with Tailwind v4)
npm install nativewind tailwindcss@3.4.17
npx expo install react-native-reanimated

# Charts + peer dependencies
npm install victory-native
npx expo install @shopify/react-native-skia react-native-gesture-handler

# Haptics + icons
npx expo install expo-haptics @expo/vector-icons

# Fonts
npx expo install expo-font @expo-google-fonts/nunito

# BLE helper (Base64 encoding)
npm install buffer

# Dev client (required for BLE)
npx expo install expo-dev-client
```

> **Critical**: BLE does not work in standard Expo Go. After setup, run:
> - `npx expo run:ios` (requires macOS + Xcode)
> - `npx expo run:android` (requires Android Studio)

---

## NativeWind v4 Configuration

### `metro.config.js`
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

### `babel.config.js`
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### `global.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `nativewind-env.d.ts`
```typescript
/// <reference types="nativewind/types" />
```

> **Critical**: `app/_layout.tsx` must import `"../global.css"` as its first import for NativeWind styles to work.

---

## Design System

### Aesthetic Direction

**Clean, modern wellness product.** Think: Dyson app, Oral-B app, Philips Hue. White/light-gray backgrounds, soft surfaces, warm coral accent. Premium but friendly — not clinical. Dark mode supported.

### Color Tokens (`constants/theme.ts`)

```typescript
export const COLORS = {
  brand:        '#FF7B5C',    // warm coral — primary accent, active states
  brandLight:   '#FF7B5C20', // coral tint — button backgrounds, cards
  brandBorder:  '#FF7B5C40', // coral border — active button outlines

  success:      '#4ECDC4',    // teal — Start button, Connected badge
  successLight: '#4ECDC420',
  danger:       '#FF4757',    // red — Stop button, errors
  dangerLight:  '#FF475720',
  warning:      '#FFA502',    // amber — Pause, caution states
  warningLight: '#FFA50220',
  info:         '#3B8BD4',    // blue — firmware update links

  bg:           '#F8F9FA',    // page background
  surface:      '#FFFFFF',    // card surface
  surfaceMuted: '#F1F3F5',    // secondary card, input backgrounds
  border:       'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.14)',

  textPrimary:  '#1A1D23',
  textSecondary:'#6B7280',
  textMuted:    '#A4B0BE',
};

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24 };
export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
```

### Typography

Use `Nunito` from Google Fonts via `expo-font`.

```
Nunito_400Regular  — body text, secondary labels
Nunito_500Medium   — default UI text
Nunito_600SemiBold — card titles, section values
Nunito_700Bold     — screen headings, button labels
```

---

## The Four Tabs

### Tab 1 — Home (`app/(tabs)/home.tsx`)

The **dashboard**. Shows the user the device at a glance and provides the most common quick actions.

**Layout (top to bottom):**
1. `GGHeader` — "Good morning" greeting + `ConnectionBadge`
2. `DeviceCard` — hero card with device name, model, firmware version, stat grid: last session duration + total session count
3. `QuickActions` — row of 3 large shortcut buttons: Start, Pause, Stop (same commands as Control tab, for convenience)
4. `RecentSessionsList` — last 3 sessions with mode, speed, duration, date

**Behavior:**
- If device not connected: `ConnectionBadge` shows red "Disconnected"; QuickActions buttons are disabled with reduced opacity
- Tapping a QuickAction sends the same BLE command as the Control tab

---

### Tab 2 — Control (`app/(tabs)/control.tsx`)

The **main control panel**. Full button grid organized into labeled sections.

**Layout (top to bottom):**
1. `ActiveStatusStrip` — live current mode, speed, and elapsed timer when running
2. **Power** section — Start, Pause, Stop (3 large buttons in a row)
3. **Mode** section — Scrub, Massage, Rinse (3 buttons; active mode highlighted)
4. **Speed** section — Low, Med, High (3 buttons; active speed highlighted)
5. **Pump** section — Pump On, Pump Off (2 buttons)

**Behavior:**
- If not connected: full-width "Connect Device" banner above the grid; all buttons disabled
- Button press: haptic → BLE write → optimistic UI update → revert + shake on failure
- Mode and Speed buttons show toggle active state (filled brand-color background)
- `ActiveStatusStrip` timer starts on `CMD:START`, stops on `CMD:STOP`

---

### Tab 3 — History (`app/(tabs)/history.tsx`)

**Session log** with weekly overview and full history list.

**Layout (top to bottom):**
1. `WeeklySummaryCard` — session count + average duration this week
2. `SessionBarChart` — `victory-native` bar chart, bars per day, brand coral color
3. `SessionLogList` — full list of sessions, grouped by date (Today / Yesterday / date headers). Each row: mode, speed, duration, time.

**Session data shape:**
```typescript
interface Session {
  id: string;
  startedAt: string;        // ISO timestamp
  durationSeconds: number;
  mode: 'SCRUB' | 'MASSAGE' | 'RINSE' | null;
  speed: 'LOW' | 'MED' | 'HIGH' | null;
  pumpUsed: boolean;
}
```

Sessions are saved to AsyncStorage when `CMD:STOP` is sent or session ends.

---

### Tab 4 — Settings (`app/(tabs)/settings.tsx`)

**Device management and preferences.**

**Layout (top to bottom):**
1. `DeviceInfoCard` — paired device name, model, firmware version, RSSI in dBm. "Connect Device" CTA if not paired.
2. Scan button — opens `DeviceScanner` modal
3. `PreferencesCard` — toggles: auto-reconnect (default on), haptic feedback (default on), session reminders (default off)
4. `DangerZoneCard` — "Check for firmware update" (blue) + "Forget device" (red, confirm dialog)

---

## BLE Protocol

### UUIDs (`constants/ble.ts`)

```typescript
export const BLE_CONFIG = {
  SERVICE_UUID:           '12345678-1234-1234-1234-123456789abc',
  CHARACTERISTIC_UUID_TX: '12345678-1234-1234-1234-123456789abd', // App → ESP32 (WRITE)
  CHARACTERISTIC_UUID_RX: '12345678-1234-1234-1234-123456789abe', // ESP32 → App (NOTIFY)
  DEVICE_NAME_PREFIX:     'GrannyGrippers',
  SCAN_TIMEOUT_MS:        10000,
  RECONNECT_DELAY_MS:     3000,
  COMMAND_DEBOUNCE_MS:    100,
} as const;
```

> These UUIDs are placeholders. Replace with real UUIDs that match what is flashed to the ESP32.

### Commands (`constants/ble.ts`)

```typescript
export const COMMANDS = {
  START:         'CMD:START',
  STOP:          'CMD:STOP',
  PAUSE:         'CMD:PAUSE',
  SPEED_LOW:     'CMD:SPEED:LOW',
  SPEED_MEDIUM:  'CMD:SPEED:MED',
  SPEED_HIGH:    'CMD:SPEED:HIGH',
  MODE_SCRUB:    'CMD:MODE:SCRUB',
  MODE_MASSAGE:  'CMD:MODE:MASSAGE',
  MODE_RINSE:    'CMD:MODE:RINSE',
  PUMP_ON:       'CMD:PUMP:ON',
  PUMP_OFF:      'CMD:PUMP:OFF',
  STATUS:        'CMD:STATUS',
} as const;

export type Command = typeof COMMANDS[keyof typeof COMMANDS];
```

### Status from ESP32

Subscribe to RX NOTIFY characteristic after connecting. ESP32 sends:

```json
{ "running": true, "mode": "SCRUB", "speed": "MED", "pump": false, "battery": 85 }
```

Parse in `BleProvider.tsx`, push to `bleStore.setDeviceStatus()`.

### Sending a Command (`hooks/useDeviceCommands.ts`)

```typescript
import { Buffer } from 'buffer';
import { useBleStore } from '../stores/bleStore';
import { BLE_CONFIG, Command } from '../constants/ble';

export function useDeviceCommands() {
  const { connectedDevice } = useBleStore();

  const sendCommand = async (command: Command): Promise<boolean> => {
    if (!connectedDevice) return false;
    try {
      const encoded = Buffer.from(command).toString('base64');
      await connectedDevice.writeCharacteristicWithResponseForService(
        BLE_CONFIG.SERVICE_UUID,
        BLE_CONFIG.CHARACTERISTIC_UUID_TX,
        encoded
      );
      return true;
    } catch (err) {
      console.error('[BLE] write failed:', command, err);
      return false;
    }
  };

  return { sendCommand };
}
```

---

## Zustand Stores

### `stores/bleStore.ts`

```typescript
import { create } from 'zustand';
import { BleManager, Device } from 'react-native-ble-plx';

interface DeviceStatus {
  isRunning: boolean;
  speed: 'LOW' | 'MED' | 'HIGH' | null;
  mode: 'SCRUB' | 'MASSAGE' | 'RINSE' | null;
  pumpActive: boolean;
  batteryLevel: number | null;
}

interface BleState {
  manager: BleManager;
  connectedDevice: Device | null;
  isConnected: boolean;
  isScanning: boolean;
  deviceStatus: DeviceStatus;
  setConnectedDevice: (device: Device | null) => void;
  setScanning: (scanning: boolean) => void;
  setDeviceStatus: (status: Partial<DeviceStatus>) => void;
  disconnect: () => Promise<void>;
}

const defaultStatus: DeviceStatus = {
  isRunning: false, speed: null, mode: null, pumpActive: false, batteryLevel: null,
};

export const useBleStore = create<BleState>((set, get) => ({
  manager: new BleManager(),
  connectedDevice: null,
  isConnected: false,
  isScanning: false,
  deviceStatus: defaultStatus,
  setConnectedDevice: (device) => set({ connectedDevice: device, isConnected: !!device }),
  setScanning: (scanning) => set({ isScanning: scanning }),
  setDeviceStatus: (status) =>
    set((s) => ({ deviceStatus: { ...s.deviceStatus, ...status } })),
  disconnect: async () => {
    const { connectedDevice } = get();
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      set({ connectedDevice: null, isConnected: false, deviceStatus: defaultStatus });
    }
  },
}));
```

### `stores/sessionStore.ts`

```typescript
import { create } from 'zustand';
import { Session } from '../types';

interface SessionState {
  sessions: Session[];
  activeSession: Partial<Session> | null;
  elapsedSeconds: number;
  startSession: () => void;
  updateActiveSession: (data: Partial<Session>) => void;
  endSession: () => void;
  loadSessions: (sessions: Session[]) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  activeSession: null,
  elapsedSeconds: 0,
  startSession: () =>
    set({
      activeSession: { id: Date.now().toString(), startedAt: new Date().toISOString() },
      elapsedSeconds: 0,
    }),
  updateActiveSession: (data) =>
    set((s) => ({ activeSession: { ...s.activeSession, ...data } })),
  endSession: () => {
    const { activeSession, elapsedSeconds, sessions } = get();
    if (!activeSession) return;
    const completed: Session = { ...(activeSession as Session), durationSeconds: elapsedSeconds };
    set({ sessions: [completed, ...sessions], activeSession: null, elapsedSeconds: 0 });
  },
  loadSessions: (sessions) => set({ sessions }),
}));
```

---

## Button Definitions (`constants/buttons.ts`)

```typescript
import { COMMANDS, Command } from './ble';

export interface ButtonDef {
  id: string;
  label: string;
  icon: string;
  command: Command;
  colorVariant: 'success' | 'danger' | 'warning' | 'brand' | 'neutral';
  section: 'power' | 'mode' | 'speed' | 'pump';
  isToggle?: boolean;
}

export const CONTROL_BUTTONS: ButtonDef[] = [
  { id: 'start',        label: 'Start',    icon: 'play-circle',        command: COMMANDS.START,         colorVariant: 'success', section: 'power' },
  { id: 'pause',        label: 'Pause',    icon: 'pause-circle',       command: COMMANDS.PAUSE,         colorVariant: 'warning', section: 'power' },
  { id: 'stop',         label: 'Stop',     icon: 'stop-circle',        command: COMMANDS.STOP,          colorVariant: 'danger',  section: 'power' },
  { id: 'mode_scrub',   label: 'Scrub',    icon: 'brush',              command: COMMANDS.MODE_SCRUB,    colorVariant: 'brand',   section: 'mode',  isToggle: true },
  { id: 'mode_massage', label: 'Massage',  icon: 'sparkles',           command: COMMANDS.MODE_MASSAGE,  colorVariant: 'brand',   section: 'mode',  isToggle: true },
  { id: 'mode_rinse',   label: 'Rinse',    icon: 'water',              command: COMMANDS.MODE_RINSE,    colorVariant: 'brand',   section: 'mode',  isToggle: true },
  { id: 'speed_low',    label: 'Low',      icon: 'speedometer-outline',command: COMMANDS.SPEED_LOW,     colorVariant: 'neutral', section: 'speed', isToggle: true },
  { id: 'speed_medium', label: 'Med',      icon: 'speedometer-outline',command: COMMANDS.SPEED_MEDIUM,  colorVariant: 'neutral', section: 'speed', isToggle: true },
  { id: 'speed_high',   label: 'High',     icon: 'speedometer',        command: COMMANDS.SPEED_HIGH,    colorVariant: 'neutral', section: 'speed', isToggle: true },
  { id: 'pump_on',      label: 'Pump On',  icon: 'water-outline',      command: COMMANDS.PUMP_ON,       colorVariant: 'brand',   section: 'pump',  isToggle: true },
  { id: 'pump_off',     label: 'Pump Off', icon: 'water-outline',      command: COMMANDS.PUMP_OFF,      colorVariant: 'neutral', section: 'pump',  isToggle: true },
];
```

---

## ControlButton Component Behavior

The most critical UI component in the app. Every interaction flows through it.

**Visual states:**
- Default: muted surface background, icon + label centered
- Active/selected (toggle): brand-colored background + border, brighter icon
- Pressed: scale to 0.94 with reanimated spring, haptic feedback
- Disabled: 40% opacity, no press response
- Success flash: green overlay fades in then out (150ms)
- Failure: red overlay + horizontal shake animation

**On press sequence:**
1. `expo-haptics` medium impact
2. Scale down animation
3. `sendCommand(button.command)` → returns boolean
4. `true`: success flash + update active state in store
5. `false`: failure flash + shake, no state change

---

## BleProvider Responsibilities

Wraps the entire app at root layout level. Manages:
- BLE permission requests on mount (iOS + Android)
- Auto-reconnect to last paired device (stored under AsyncStorage key `gg_last_device_id`)
- After connecting: subscribe to RX NOTIFY, parse JSON status, push to `bleStore.setDeviceStatus()`
- On disconnect: retry reconnect every `RECONNECT_DELAY_MS` (max 3 retries)
- Expose `scan()` and `connectToDevice(device)` via store actions

---

## Permissions

### iOS (`app.json`):
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSBluetoothAlwaysUsageDescription": "Granny Grippers uses Bluetooth to connect to and control your foot cleaner.",
        "NSBluetoothPeripheralUsageDescription": "Granny Grippers uses Bluetooth to control your foot cleaner."
      }
    }
  }
}
```

### Android (`app.json`):
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_SCAN",
        "android.permission.BLUETOOTH_CONNECT",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

---

## Tab Bar Icon Map

| Tab | Inactive icon | Active icon |
|---|---|---|
| Home | `home-outline` | `home` |
| Control | `game-controller-outline` | `game-controller` |
| History | `time-outline` | `time` |
| Settings | `settings-outline` | `settings-sharp` |

---

## Architecture Notes

- **BLE Manager is a singleton** — instantiate once in `BleProvider`, store reference in `bleStore`. Never create it inside a component.
- **Command debouncing** — debounce rapid presses by `COMMAND_DEBOUNCE_MS` to avoid flooding the ESP32.
- **Optimistic UI** — update mode/speed active state immediately. Revert only on write failure.
- **Session timer** — `setInterval` in `sessionStore.startSession()`. Clear on `endSession()`. Tick `elapsedSeconds` every second.
- **Session persistence** — call `sessionStorage.saveSessions()` in `endSession()`. Load on app start inside `BleProvider`.

---

## ESP32 Firmware Notes (not in app scope — for reference)

The ESP32 must:
1. Advertise BLE with a name starting with `GrannyGrippers`
2. Host a GATT service with the two UUIDs above (TX = WRITE, RX = NOTIFY)
3. Parse UTF-8 strings matching `CMD:*` format from the TX characteristic
4. Respond over the RX NOTIFY characteristic with a JSON status string after each state change

---

## Build Order (Priority)

1. `types/index.ts`
2. `constants/ble.ts` + `constants/buttons.ts` + `constants/theme.ts`
3. `stores/bleStore.ts` + `stores/sessionStore.ts`
4. `utils/sessionStorage.ts` + `utils/bleHelpers.ts`
5. `hooks/useDeviceCommands.ts` + `hooks/useBle.ts` + `hooks/useSessions.ts`
6. `components/ble/BleProvider.tsx`
7. `components/ui/*` (Card, SectionHeader, ConnectionBadge, GGHeader)
8. `components/control/ControlButton.tsx` ← build this carefully, it's the core component
9. `components/control/ControlGrid.tsx` + `ActiveStatusStrip.tsx`
10. `app/(tabs)/control.tsx`
11. `components/home/*` + `app/(tabs)/home.tsx`
12. `components/history/*` + `app/(tabs)/history.tsx`
13. `components/settings/*` + `app/(tabs)/settings.tsx`
14. `components/ble/DeviceScanner.tsx`
15. `app/index.tsx` (splash / onboarding)

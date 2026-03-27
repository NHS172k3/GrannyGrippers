import { create } from 'zustand';
import type { BleManager, Device } from 'react-native-ble-plx';
import type { DeviceStatus } from '../types';

interface BleActions {
  scan: () => Promise<void>;
  connect: (device: Device) => Promise<boolean>;
}

interface BleState {
  manager: BleManager | null;
  connectedDevice: Device | null;
  isConnected: boolean;
  isScanning: boolean;
  rssi: number | null;
  discoveredDevices: Device[];
  deviceStatus: DeviceStatus;
  setManager: (manager: BleManager) => void;
  setRssi: (rssi: number | null) => void;
  setConnectedDevice: (device: Device | null) => void;
  setScanning: (scanning: boolean) => void;
  setDeviceStatus: (status: Partial<DeviceStatus>) => void;
  addDiscoveredDevice: (device: Device) => void;
  clearDiscoveredDevices: () => void;
  setBleActions: (actions: BleActions) => void;
  scan: () => Promise<void>;
  connectToDevice: (device: Device) => Promise<boolean>;
  disconnect: () => Promise<void>;
}

const defaultStatus: DeviceStatus = {
  isRunning: false,
  speed: null,
  mode: null,
  pumpActive: false,
  batteryLevel: null,
};

export const useBleStore = create<BleState>((set, get) => ({
  manager: null,
  connectedDevice: null,
  isConnected: false,
  isScanning: false,
  rssi: null,
  discoveredDevices: [],
  deviceStatus: defaultStatus,

  setManager: (manager) => set({ manager }),

  setRssi: (rssi) => set({ rssi }),

  setConnectedDevice: (device) =>
    set({ connectedDevice: device, isConnected: !!device }),

  setScanning: (scanning) => set({ isScanning: scanning }),

  setDeviceStatus: (status) =>
    set((s) => ({ deviceStatus: { ...s.deviceStatus, ...status } })),

  addDiscoveredDevice: (device) =>
    set((s) => {
      const exists = s.discoveredDevices.some((d) => d.id === device.id);
      if (exists) return s;
      return { discoveredDevices: [...s.discoveredDevices, device] };
    }),

  clearDiscoveredDevices: () => set({ discoveredDevices: [] }),

  setBleActions: (actions) =>
    set({
      scan: actions.scan,
      connectToDevice: actions.connect,
    }),

  scan: async () => {},

  connectToDevice: async () => false,

  disconnect: async () => {
    const { connectedDevice } = get();
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
      } catch {
        // Device may already be disconnected
      }
      set({
        connectedDevice: null,
        isConnected: false,
        rssi: null,
        deviceStatus: defaultStatus,
      });
    }
  },
}));

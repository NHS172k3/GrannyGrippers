import React, { useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager, State, type Subscription, type Device } from 'react-native-ble-plx';
import { useBleStore } from '../../stores/bleStore';
import { useSessionStore } from '../../stores/sessionStore';
import { usePreferencesStore } from '../../stores/preferencesStore';
import { BLE_CONFIG } from '../../constants/ble';
import { parseDeviceStatus } from '../../utils/bleHelpers';
import { getLastDeviceId, setLastDeviceId, loadSessions } from '../../utils/sessionStorage';

interface Props {
  children: React.ReactNode;
}

async function requestPermissions() {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    if (apiLevel >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      const allGranted = Object.values(results).every(
        (r) => r === PermissionsAndroid.RESULTS.GRANTED
      );
      if (!allGranted) {
        console.warn('[BLE] Some permissions were not granted');
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('[BLE] Location permission not granted');
      }
    }
  }
}

export default function BleProvider({ children }: Readonly<Props>) {
  const managerRef = useRef<BleManager>(new BleManager());
  const reconnectAttempts = useRef(0);
  const monitorSubscription = useRef<Subscription | null>(null);
  const disconnectSubscription = useRef<Subscription | null>(null);
  const rssiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    useBleStore.getState().setManager(managerRef.current);
    useBleStore.getState().setBleActions({
      scan: scanForDevices,
      connect: connectToDevice,
    });

    void initApp();

    return () => {
      const manager = managerRef.current;
      monitorSubscription.current?.remove();
      disconnectSubscription.current?.remove();
      if (rssiIntervalRef.current) {
        clearInterval(rssiIntervalRef.current);
      }
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  async function initApp() {
    // Load saved sessions
    const saved = await loadSessions();
    if (saved.length > 0) {
      useSessionStore.getState().loadSessions(saved);
    }

    // Load preferences
    await usePreferencesStore.getState().loadPreferences();

    // Request BLE permissions
    await requestPermissions();

    // Wait for BLE to be powered on, then try auto-reconnect
    const manager = managerRef.current;
    const subscription = manager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        subscription.remove();
        void attemptAutoReconnect();
      }
    }, true);
  }

  async function attemptAutoReconnect() {
    const prefs = usePreferencesStore.getState();
    if (!prefs.autoReconnect) return;

    const lastDeviceId = await getLastDeviceId();
    if (!lastDeviceId) return;

    const manager = managerRef.current;
    try {
      const device = await manager.connectToDevice(lastDeviceId, { timeout: 12000 });
      await onDeviceConnected(device, true);
    } catch {
      console.log('[BLE] Auto-reconnect failed');
    }
  }

  async function onDeviceConnected(device: Device, preserveRetryState = false) {
    await device.discoverAllServicesAndCharacteristics();
    useBleStore.getState().setConnectedDevice(device);
    await setLastDeviceId(device.id);
    if (!preserveRetryState) {
      reconnectAttempts.current = 0;
    }

    // Prime initial RSSI and keep it refreshed while connected.
    try {
      const withRssi = await device.readRSSI();
      if (typeof withRssi.rssi === 'number') {
        useBleStore.getState().setRssi(withRssi.rssi);
      }
    } catch {
      useBleStore.getState().setRssi(null);
    }
    if (rssiIntervalRef.current) {
      clearInterval(rssiIntervalRef.current);
    }
    rssiIntervalRef.current = setInterval(() => {
      void (async () => {
        const current = useBleStore.getState().connectedDevice;
        if (!current) return;
        try {
          const withRssi = await current.readRSSI();
          useBleStore.getState().setRssi(withRssi.rssi ?? null);
        } catch {
          useBleStore.getState().setRssi(null);
        }
      })();
    }, 4000);

    // Subscribe to status notifications
    monitorSubscription.current?.remove();
    monitorSubscription.current = device.monitorCharacteristicForService(
      BLE_CONFIG.SERVICE_UUID,
      BLE_CONFIG.CHARACTERISTIC_UUID_RX,
      (error, characteristic) => {
        if (error) {
          console.error('[BLE] Monitor error:', error.message);
          return;
        }
        if (characteristic?.value) {
          const status = parseDeviceStatus(characteristic.value);
          if (status) {
            useBleStore.getState().setDeviceStatus(status);
          }
        }
      }
    );

    // Listen for disconnection
    disconnectSubscription.current?.remove();
    disconnectSubscription.current = device.onDisconnected((error) => {
      console.log('[BLE] Device disconnected', error?.message);
      useBleStore.getState().setConnectedDevice(null);
      useBleStore.getState().setRssi(null);
      monitorSubscription.current?.remove();
      if (rssiIntervalRef.current) {
        clearInterval(rssiIntervalRef.current);
        rssiIntervalRef.current = null;
      }

      if (
        usePreferencesStore.getState().autoReconnect &&
        reconnectAttempts.current < BLE_CONFIG.MAX_RECONNECT_RETRIES
      ) {
        reconnectAttempts.current++;
        setTimeout(() => {
          void attemptAutoReconnect();
        }, BLE_CONFIG.RECONNECT_DELAY_MS);
      }
    });
  }

  return <>{children}</>;
}

// Exported for use by DeviceScanner
export async function scanForDevices() {
  const { manager, setScanning, addDiscoveredDevice, clearDiscoveredDevices } =
    useBleStore.getState();
  if (!manager) return;

  clearDiscoveredDevices();
  setScanning(true);

  manager.startDeviceScan(
    [BLE_CONFIG.SERVICE_UUID],
    { allowDuplicates: false },
    (error, device) => {
      if (error) {
        console.error('[BLE] Scan error:', error.message);
        setScanning(false);
        return;
      }
      if (device?.name?.startsWith(BLE_CONFIG.DEVICE_NAME_PREFIX)) {
        addDiscoveredDevice(device);
      }
    }
  );

  setTimeout(() => {
    manager.stopDeviceScan();
    setScanning(false);
  }, BLE_CONFIG.SCAN_TIMEOUT_MS);
}

export async function connectToDevice(device: Device) {
  const manager = useBleStore.getState().manager;
  if (!manager) return false;
  manager.stopDeviceScan();
  useBleStore.getState().setScanning(false);

  try {
    const connected = await device.connect();
    await connected.discoverAllServicesAndCharacteristics();
    useBleStore.getState().setConnectedDevice(connected);
    await setLastDeviceId(connected.id);
    try {
      const withRssi = await connected.readRSSI();
      useBleStore.getState().setRssi(withRssi.rssi ?? null);
    } catch {
      useBleStore.getState().setRssi(null);
    }

    // Subscribe to notifications
    connected.monitorCharacteristicForService(
      BLE_CONFIG.SERVICE_UUID,
      BLE_CONFIG.CHARACTERISTIC_UUID_RX,
      (error, characteristic) => {
        if (error) return;
        if (characteristic?.value) {
          const status = parseDeviceStatus(characteristic.value);
          if (status) {
            useBleStore.getState().setDeviceStatus(status);
          }
        }
      }
    );

    connected.onDisconnected(() => {
      useBleStore.getState().setConnectedDevice(null);
      useBleStore.getState().setRssi(null);
    });

    return true;
  } catch (err) {
    console.error('[BLE] Connection failed:', err);
    return false;
  }
}

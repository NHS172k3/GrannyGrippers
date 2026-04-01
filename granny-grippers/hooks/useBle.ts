import { useBleStore } from '../stores/bleStore';

export function useBle() {
  const isConnected = useBleStore((s) => s.isConnected);
  const isScanning = useBleStore((s) => s.isScanning);
  const rssi = useBleStore((s) => s.rssi);
  const deviceStatus = useBleStore((s) => s.deviceStatus);
  const connectedDevice = useBleStore((s) => s.connectedDevice);
  const discoveredDevices = useBleStore((s) => s.discoveredDevices);
  const scanError = useBleStore((s) => s.scanError);
  const scan = useBleStore((s) => s.scan);
  const connectToDevice = useBleStore((s) => s.connectToDevice);
  const disconnect = useBleStore((s) => s.disconnect);

  return {
    isConnected,
    isScanning,
    scanError,
    rssi,
    deviceStatus,
    connectedDevice,
    discoveredDevices,
    scan,
    connectToDevice,
    disconnect,
  };
}

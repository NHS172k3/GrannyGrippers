import { Buffer } from 'buffer';

export function encodeCommand(command: string): string {
  return Buffer.from(command, 'utf-8').toString('base64');
}

export function decodeResponse(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function parseDeviceStatus(base64: string) {
  try {
    const json = decodeResponse(base64);
    const data = JSON.parse(json);
    return {
      mainSpeed: data.mainSpeed ?? null,
      heelSpeed: data.heelSpeed ?? null,
      pumpActive: Boolean(data.pump),
      batteryLevel: typeof data.battery === 'number' ? data.battery : null,
    };
  } catch {
    return null;
  }
}

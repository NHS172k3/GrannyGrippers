import { describe, expect, it } from 'vitest';
import { decodeResponse, encodeCommand, parseDeviceStatus } from '../utils/bleHelpers';

describe('bleHelpers', () => {
  it('encodes and decodes BLE command payloads', () => {
    const command = 'CMD:START';
    const encoded = encodeCommand(command);

    expect(encoded).toBe('Q01EOlNUQVJU');
    expect(decodeResponse(encoded)).toBe(command);
  });

  it('parses base64 JSON device status payload', () => {
    const payload = Buffer.from(
      JSON.stringify({ running: true, mode: 'SCRUB', speed: 'MED', pump: false, battery: 87 }),
      'utf-8'
    ).toString('base64');

    const status = parseDeviceStatus(payload);

    expect(status).toEqual({
      isRunning: true,
      mode: 'SCRUB',
      speed: 'MED',
      pumpActive: false,
      batteryLevel: 87,
    });
  });

  it('returns null when payload is malformed', () => {
    expect(parseDeviceStatus('not-base64')).toBeNull();
  });
});

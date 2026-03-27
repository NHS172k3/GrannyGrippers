import { useRef, useCallback } from 'react';
import { useBleStore } from '../stores/bleStore';
import { useSessionStore } from '../stores/sessionStore';
import { BLE_CONFIG, COMMANDS, type Command } from '../constants/ble';
import { encodeCommand } from '../utils/bleHelpers';

function getOptimisticStatus(command: Command) {
  switch (command) {
    case COMMANDS.START:
      return { isRunning: true };
    case COMMANDS.STOP:
      return { isRunning: false };
    case COMMANDS.PAUSE:
      return { isRunning: false };
    case COMMANDS.MODE_SCRUB:
      return { mode: 'SCRUB' as const };
    case COMMANDS.MODE_MASSAGE:
      return { mode: 'MASSAGE' as const };
    case COMMANDS.MODE_RINSE:
      return { mode: 'RINSE' as const };
    case COMMANDS.SPEED_LOW:
      return { speed: 'LOW' as const };
    case COMMANDS.SPEED_MEDIUM:
      return { speed: 'MED' as const };
    case COMMANDS.SPEED_HIGH:
      return { speed: 'HIGH' as const };
    case COMMANDS.PUMP_ON:
      return { pumpActive: true };
    case COMMANDS.PUMP_OFF:
      return { pumpActive: false };
    default:
      return null;
  }
}

export function useDeviceCommands() {
  const connectedDevice = useBleStore((s) => s.connectedDevice);
  const setDeviceStatus = useBleStore((s) => s.setDeviceStatus);
  const startSession = useSessionStore((s) => s.startSession);
  const endSession = useSessionStore((s) => s.endSession);
  const updateActiveSession = useSessionStore((s) => s.updateActiveSession);
  const lastCommandTime = useRef(0);

  const sendCommand = useCallback(
    async (command: Command): Promise<boolean> => {
      if (!connectedDevice) return false;

      const now = Date.now();
      if (now - lastCommandTime.current < BLE_CONFIG.COMMAND_DEBOUNCE_MS) {
        return false;
      }
      lastCommandTime.current = now;

      const prevStatus = useBleStore.getState().deviceStatus;
      const optimisticStatus = getOptimisticStatus(command);
      if (optimisticStatus) {
        setDeviceStatus(optimisticStatus);
      }

      try {
        const encoded = encodeCommand(command);
        await connectedDevice.writeCharacteristicWithResponseForService(
          BLE_CONFIG.SERVICE_UUID,
          BLE_CONFIG.CHARACTERISTIC_UUID_TX,
          encoded
        );

        handleSuccessSideEffects(command);
        return true;
      } catch (err) {
        if (optimisticStatus) {
          setDeviceStatus(prevStatus);
        }
        console.error('[BLE] write failed:', command, err);
        return false;
      }
    },
    [connectedDevice, setDeviceStatus]
  );

  function handleSuccessSideEffects(command: Command) {
    switch (command) {
      case COMMANDS.START:
        startSession();
        break;
      case COMMANDS.STOP:
        endSession();
        break;
      case COMMANDS.MODE_SCRUB:
        updateActiveSession({ mode: 'SCRUB' });
        break;
      case COMMANDS.MODE_MASSAGE:
        updateActiveSession({ mode: 'MASSAGE' });
        break;
      case COMMANDS.MODE_RINSE:
        updateActiveSession({ mode: 'RINSE' });
        break;
      case COMMANDS.SPEED_LOW:
        updateActiveSession({ speed: 'LOW' });
        break;
      case COMMANDS.SPEED_MEDIUM:
        updateActiveSession({ speed: 'MED' });
        break;
      case COMMANDS.SPEED_HIGH:
        updateActiveSession({ speed: 'HIGH' });
        break;
      case COMMANDS.PUMP_ON:
        updateActiveSession({ pumpUsed: true });
        break;
      default:
        break;
    }
  }

  return { sendCommand };
}

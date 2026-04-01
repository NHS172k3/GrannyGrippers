import { useRef, useCallback } from 'react';
import { useBleStore } from '../stores/bleStore';
import { useSessionStore } from '../stores/sessionStore';
import { BLE_CONFIG, COMMANDS, type Command } from '../constants/ble';
import { encodeCommand } from '../utils/bleHelpers';

function getOptimisticStatus(command: Command) {
  switch (command) {
    // Global
    case COMMANDS.START:
      return { mainSpeed: 'LOW' as const, heelSpeed: 'LOW' as const };
    case COMMANDS.STOP:
      return { mainSpeed: 'OFF' as const, heelSpeed: 'OFF' as const };

    // Program presets — optimistically set both zones at once
    case COMMANDS.MODE_SCRUB:
      return { mainSpeed: 'HIGH' as const, heelSpeed: 'HIGH' as const };
    case COMMANDS.MODE_MASSAGE:
      return { mainSpeed: 'LOW' as const, heelSpeed: 'LOW' as const };
    case COMMANDS.MODE_RINSE:
      return { mainSpeed: 'LOW' as const, heelSpeed: 'OFF' as const };

    // Sole per-speed
    case COMMANDS.SOLE_OFF:      return { mainSpeed: 'OFF'  as const };
    case COMMANDS.SOLE_GENTLE:   return { mainSpeed: 'LOW'  as const };
    case COMMANDS.SOLE_STANDARD: return { mainSpeed: 'MED'  as const };
    case COMMANDS.SOLE_POWER:    return { mainSpeed: 'HIGH' as const };

    // Heel per-speed
    case COMMANDS.HEEL_OFF:      return { heelSpeed: 'OFF'  as const };
    case COMMANDS.HEEL_GENTLE:   return { heelSpeed: 'LOW'  as const };
    case COMMANDS.HEEL_STANDARD: return { heelSpeed: 'MED'  as const };
    case COMMANDS.HEEL_POWER:    return { heelSpeed: 'HIGH' as const };

    // Pump
    case COMMANDS.PUMP_ON:  return { pumpActive: true  };
    case COMMANDS.PUMP_OFF: return { pumpActive: false };

    default: return null;
  }
}

export function useDeviceCommands() {
  const connectedDevice    = useBleStore((s) => s.connectedDevice);
  const setDeviceStatus    = useBleStore((s) => s.setDeviceStatus);
  const startSession       = useSessionStore((s) => s.startSession);
  const endSession         = useSessionStore((s) => s.endSession);
  const updateActiveSession = useSessionStore((s) => s.updateActiveSession);
  const lastCommandTime    = useRef(0);

  const sendCommand = useCallback(
    async (command: Command): Promise<boolean> => {
      if (!connectedDevice) return false;

      const now = Date.now();
      if (now - lastCommandTime.current < BLE_CONFIG.COMMAND_DEBOUNCE_MS) return false;
      lastCommandTime.current = now;

      const prevStatus     = useBleStore.getState().deviceStatus;
      const optimisticStatus = getOptimisticStatus(command);
      if (optimisticStatus) setDeviceStatus(optimisticStatus);

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
        if (optimisticStatus) setDeviceStatus(prevStatus);
        console.error('[BLE] write failed:', command, err);
        return false;
      }
    },
    [connectedDevice, setDeviceStatus]
  );

  function handleSuccessSideEffects(command: Command) {
    const status = getOptimisticStatus(command);
    switch (command) {
      case COMMANDS.START:
        startSession();
        break;
      case COMMANDS.STOP:
        endSession();
        break;
      case COMMANDS.MODE_SCRUB:
      case COMMANDS.MODE_MASSAGE:
      case COMMANDS.MODE_RINSE:
        if (status && 'mainSpeed' in status) updateActiveSession({ mainSpeed: status.mainSpeed });
        if (status && 'heelSpeed' in status) updateActiveSession({ heelSpeed: status.heelSpeed });
        break;
      case COMMANDS.SOLE_GENTLE:
      case COMMANDS.SOLE_STANDARD:
      case COMMANDS.SOLE_POWER:
        if (status && 'mainSpeed' in status) updateActiveSession({ mainSpeed: status.mainSpeed });
        break;
      case COMMANDS.HEEL_GENTLE:
      case COMMANDS.HEEL_STANDARD:
      case COMMANDS.HEEL_POWER:
        if (status && 'heelSpeed' in status) updateActiveSession({ heelSpeed: status.heelSpeed });
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

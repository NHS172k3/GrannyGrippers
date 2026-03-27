import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMMANDS, type Command } from '../../constants/ble';
import { useBle } from '../../hooks/useBle';
import { useDeviceCommands } from '../../hooks/useDeviceCommands';
import { COLORS } from '../../constants/theme';

type ActionLabel = 'Start' | 'Pause' | 'Stop';

const ACTIONS: { label: ActionLabel; icon: React.ComponentProps<typeof Ionicons>['name']; command: Command; colorClass: string; textClass: string }[] = [
  { label: 'Start', icon: 'play-circle', command: COMMANDS.START, colorClass: 'bg-success-light', textClass: 'text-success' },
  { label: 'Pause', icon: 'pause-circle', command: COMMANDS.PAUSE, colorClass: 'bg-warning-light', textClass: 'text-warning' },
  { label: 'Stop', icon: 'stop-circle', command: COMMANDS.STOP, colorClass: 'bg-danger-light', textClass: 'text-danger' },
];

const ACTION_COLORS = {
  Start: COLORS.success,
  Pause: COLORS.warning,
  Stop: COLORS.danger,
} as const;

export default function QuickActions() {
  const { isConnected } = useBle();
  const { sendCommand } = useDeviceCommands();

  return (
    <View className="mb-4">
      <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted mb-2 px-1">
        Quick Actions
      </Text>
      <View className="flex-row gap-3">
        {ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => sendCommand(action.command)}
            disabled={!isConnected}
            className={`flex-1 rounded-2xl p-3.5 items-center border border-gg-border ${action.colorClass} ${
              isConnected ? '' : 'opacity-45'
            }`}
          >
            <Ionicons name={action.icon} size={24} color={ACTION_COLORS[action.label]} />
            <Text className={`mt-1 text-sm font-nunito-bold ${action.textClass}`}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

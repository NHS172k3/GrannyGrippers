import React from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMMANDS, type Command } from '../../constants/ble';
import { useBle } from '../../hooks/useBle';
import { useDeviceCommands } from '../../hooks/useDeviceCommands';
import { COLORS, DARK_COLORS } from '../../constants/theme';

export default function QuickActions() {
  const { isConnected } = useBle();
  const { sendCommand } = useDeviceCommands();
  const t = useColorScheme() === 'dark' ? DARK_COLORS : COLORS;

  const ACTIONS = [
    {
      label:     'Start',
      icon:      'play-circle'  as const,
      command:   COMMANDS.START,
      bgColor:   t.successLight,
      textColor: t.success,
      iconColor: t.success,
      border:    t.success,
    },
    {
      label:     'Stop',
      icon:      'stop-circle'  as const,
      command:   COMMANDS.STOP,
      bgColor:   t.dangerLight,
      textColor: t.danger,
      iconColor: t.danger,
      border:    t.danger,
    },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-nunito-bold uppercase tracking-widest text-text-muted dark:text-dark-text-muted mb-3 px-1">
        Quick Actions
      </Text>
      <View className="flex-row gap-3">
        {ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => sendCommand(action.command as Command)}
            disabled={!isConnected}
            style={{
              flex: 1,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              borderWidth: 1,
              backgroundColor: action.bgColor,
              borderColor: action.border,
              opacity: isConnected ? 1 : 0.4,
            }}
          >
            <Ionicons name={action.icon} size={34} color={action.iconColor} />
            <Text
              style={{
                marginTop: 6,
                fontSize: 16,
                fontFamily: 'Nunito_700Bold',
                color: action.textColor,
              }}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

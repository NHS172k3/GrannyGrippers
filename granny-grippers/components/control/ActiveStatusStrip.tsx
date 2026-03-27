import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBle } from '../../hooks/useBle';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';
import { COLORS } from '../../constants/theme';

export default function ActiveStatusStrip() {
  const { deviceStatus, isConnected } = useBle();
  const elapsedSeconds = useSessionStore((s) => s.elapsedSeconds);
  const activeSession = useSessionStore((s) => s.activeSession);

  if (!isConnected || !deviceStatus.isRunning || !activeSession) return null;

  return (
    <View className="bg-brand-light border border-brand-border rounded-2xl px-4 py-3 mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-2.5 h-2.5 rounded-full bg-brand mr-2" />
        <Text className="text-sm font-nunito-semibold text-brand">Running</Text>
      </View>

      <View className="flex-row items-center gap-4">
        {deviceStatus.mode && (
          <View className="flex-row items-center">
            <Ionicons name="options-outline" size={14} color={COLORS.textSecondary} />
            <Text className="text-xs font-nunito-medium text-text-secondary ml-1">
              {deviceStatus.mode}
            </Text>
          </View>
        )}

        {deviceStatus.speed && (
          <View className="flex-row items-center">
            <Ionicons name="speedometer-outline" size={14} color={COLORS.textSecondary} />
            <Text className="text-xs font-nunito-medium text-text-secondary ml-1">
              {deviceStatus.speed}
            </Text>
          </View>
        )}

        <View className="flex-row items-center">
          <Ionicons name="timer-outline" size={14} color={COLORS.brand} />
          <Text className="text-sm font-nunito-bold text-brand ml-1">
            {formatDuration(elapsedSeconds)}
          </Text>
        </View>
      </View>
    </View>
  );
}

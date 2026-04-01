import React from 'react';
import { Text, View } from 'react-native';
import Card from '../ui/Card';
import ConnectionBadge from '../ui/ConnectionBadge';
import { useBle } from '../../hooks/useBle';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';

export default function DeviceCard() {
  const { connectedDevice, isConnected, deviceStatus } = useBle();
  const sessions    = useSessionStore((s) => s.sessions);
  const lastSession = sessions[0];

  const batteryLabel =
    isConnected && typeof deviceStatus.batteryLevel === 'number'
      ? `${deviceStatus.batteryLevel}%`
      : '—';

  return (
    <Card className="mb-4">
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-nunito-bold text-text-primary dark:text-dark-text-primary">
            Granny Grippers
          </Text>
          <Text className="text-base font-nunito-medium text-text-secondary dark:text-dark-text-secondary mt-0.5">
            {connectedDevice?.name ?? 'No device paired'}
          </Text>
        </View>
        <ConnectionBadge />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl p-4 bg-surface-muted dark:bg-dark-surface-muted">
          <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
            Last Session
          </Text>
          <Text className="mt-2 text-2xl font-nunito-bold text-text-primary dark:text-dark-text-primary">
            {lastSession ? formatDuration(lastSession.durationSeconds) : '—'}
          </Text>
        </View>
        <View className="flex-1 rounded-xl p-4 bg-surface-muted dark:bg-dark-surface-muted">
          <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
            Total Sessions
          </Text>
          <Text className="mt-2 text-2xl font-nunito-bold text-text-primary dark:text-dark-text-primary">
            {sessions.length}
          </Text>
        </View>
        <View className="flex-1 rounded-xl p-4 bg-surface-muted dark:bg-dark-surface-muted">
          <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
            Battery
          </Text>
          <Text className="mt-2 text-2xl font-nunito-bold text-text-primary dark:text-dark-text-primary">
            {batteryLabel}
          </Text>
        </View>
      </View>
    </Card>
  );
}

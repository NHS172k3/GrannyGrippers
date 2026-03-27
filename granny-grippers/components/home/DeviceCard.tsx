import React from 'react';
import { Text, View } from 'react-native';
import Card from '../ui/Card';
import ConnectionBadge from '../ui/ConnectionBadge';
import { useBle } from '../../hooks/useBle';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';

export default function DeviceCard() {
  const { connectedDevice } = useBle();
  const sessions = useSessionStore((s) => s.sessions);

  const lastSession = sessions[0];

  return (
    <Card className="mb-4">
      <View className="flex-row items-start justify-between mb-3">
        <View>
          <Text className="text-lg font-nunito-bold text-text-primary">Granny Grippers</Text>
          <Text className="text-sm font-nunito-medium text-text-secondary mt-0.5">
            {connectedDevice?.name || 'No device paired'}
          </Text>
          <Text className="text-xs font-nunito-medium text-text-muted mt-1">Firmware v1.0.0</Text>
        </View>
        <ConnectionBadge />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl p-3 bg-surface-muted">
          <Text className="text-xs font-nunito-semibold uppercase tracking-widest text-text-muted">
            Last Session
          </Text>
          <Text className="mt-2 text-xl font-nunito-bold text-text-primary">
            {lastSession ? formatDuration(lastSession.durationSeconds) : '--:--'}
          </Text>
        </View>
        <View className="flex-1 rounded-xl p-3 bg-surface-muted">
          <Text className="text-xs font-nunito-semibold uppercase tracking-widest text-text-muted">
            Total Sessions
          </Text>
          <Text className="mt-2 text-xl font-nunito-bold text-text-primary">{sessions.length}</Text>
        </View>
      </View>
    </Card>
  );
}

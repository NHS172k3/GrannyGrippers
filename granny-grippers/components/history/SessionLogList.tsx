import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Card from '../ui/Card';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration, getRelativeDateLabel } from '../../hooks/useSessions';

export default function SessionLogList() {
  const sessions = useSessionStore((s) => s.sessions);

  const grouped = useMemo(() => {
    return sessions.reduce<Record<string, typeof sessions>>((acc, session) => {
      const key = getRelativeDateLabel(session.startedAt);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(session);
      return acc;
    }, {});
  }, [sessions]);

  const labels = Object.keys(grouped);

  return (
    <View>
      <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted mb-2 px-1">
        Full History
      </Text>
      {labels.length === 0 ? (
        <Card>
          <Text className="font-nunito-medium text-text-secondary">No session history yet.</Text>
        </Card>
      ) : (
        <View className="gap-3">
          {labels.map((label) => (
            <View key={label}>
              <Text className="text-sm font-nunito-bold text-text-primary mb-2 px-1">{label}</Text>
              <View className="gap-2">
                {grouped[label].map((session) => (
                  <Card key={session.id}>
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="font-nunito-bold text-text-primary">
                          {session.mode || 'Mode Unset'} / {session.speed || 'Speed Unset'}
                        </Text>
                        <Text className="text-xs font-nunito-medium text-text-muted mt-1">
                          {new Date(session.startedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Text className="font-nunito-bold text-brand">
                        {formatDuration(session.durationSeconds)}
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Card from '../ui/Card';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';

export default function RecentSessionsList() {
  const allSessions = useSessionStore((s) => s.sessions);
  const sessions = useMemo(() => allSessions.slice(0, 3), [allSessions]);

  return (
    <View>
      <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted mb-2 px-1">
        Recent Sessions
      </Text>
      {sessions.length === 0 ? (
        <Card>
          <Text className="font-nunito-medium text-text-secondary">No sessions recorded yet.</Text>
        </Card>
      ) : (
        <View className="gap-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-base font-nunito-bold text-text-primary">
                    {session.mode || 'Mode Unset'} / {session.speed || 'Speed Unset'}
                  </Text>
                  <Text className="text-xs font-nunito-medium text-text-muted mt-1">
                    {new Date(session.startedAt).toLocaleString()}
                  </Text>
                </View>
                <Text className="text-base font-nunito-bold text-brand">
                  {formatDuration(session.durationSeconds)}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

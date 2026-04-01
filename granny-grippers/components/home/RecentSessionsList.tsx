import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Card from '../ui/Card';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';
import { SPEED_DISPLAY } from '../../types';

export default function RecentSessionsList() {
  const allSessions = useSessionStore((s) => s.sessions);
  const sessions = useMemo(() => allSessions.slice(0, 3), [allSessions]);

  return (
    <View>
      <Text className="text-sm font-nunito-bold uppercase tracking-widest text-text-muted dark:text-dark-text-muted mb-3 px-1">
        Recent Sessions
      </Text>
      {sessions.length === 0 ? (
        <Card>
          <Text className="text-base font-nunito-medium text-text-primary dark:text-dark-text-primary">
            No sessions recorded yet.
          </Text>
        </Card>
      ) : (
        <View className="gap-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-base font-nunito-bold text-text-primary dark:text-dark-text-primary">
                    Sole: {SPEED_DISPLAY[session.mainSpeed ?? 'OFF'] ?? 'Off'} · Heel: {SPEED_DISPLAY[session.heelSpeed ?? 'OFF'] ?? 'Off'}
                  </Text>
                  <Text className="text-sm font-nunito-medium text-text-muted dark:text-dark-text-muted mt-1">
                    {new Date(session.startedAt).toLocaleString()}
                  </Text>
                </View>
                <Text className="text-lg font-nunito-bold text-brand">
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

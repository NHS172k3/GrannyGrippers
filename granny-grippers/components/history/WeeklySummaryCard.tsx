import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Card from '../ui/Card';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function WeeklySummaryCard() {
  const sessions = useSessionStore((s) => s.sessions);

  const { count, avgSeconds } = useMemo(() => {
    const startOfWeek = getWeekStart(new Date());
    const weekSessions = sessions.filter((s) => new Date(s.startedAt) >= startOfWeek);
    const total = weekSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
    const avg   = weekSessions.length > 0 ? Math.round(total / weekSessions.length) : 0;
    return { count: weekSessions.length, avgSeconds: avg };
  }, [sessions]);

  return (
    <Card className="mb-4">
      <Text className="text-base font-nunito-bold text-text-primary dark:text-dark-text-primary">
        This Week
      </Text>
      <View className="flex-row gap-3 mt-3">
        <View className="flex-1 rounded-xl p-3 bg-brand-light dark:bg-dark-brand-light border border-brand-border">
          <Text className="text-xs font-nunito-semibold uppercase tracking-widest text-brand">
            Sessions
          </Text>
          <Text className="text-2xl font-nunito-bold text-brand mt-1">{count}</Text>
        </View>
        <View className="flex-1 rounded-xl p-3 bg-surface-muted dark:bg-dark-surface-muted">
          <Text className="text-xs font-nunito-semibold uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
            Avg Duration
          </Text>
          <Text className="text-2xl font-nunito-bold text-text-primary dark:text-dark-text-primary mt-1">
            {formatDuration(avgSeconds)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

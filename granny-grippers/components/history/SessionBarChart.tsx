import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';
import Card from '../ui/Card';
import { useSessionStore } from '../../stores/sessionStore';
import { COLORS } from '../../constants/theme';

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export default function SessionBarChart() {
  const sessions = useSessionStore((s) => s.sessions);

  const data = useMemo(() => {
    const today = new Date();
    const items: { x: string; y: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = day.toDateString();
      const count = sessions.filter((s) => new Date(s.startedAt).toDateString() === key).length;
      items.push({ x: formatDay(day), y: count });
    }

    return items;
  }, [sessions]);

  return (
    <Card className="mb-4">
      <Text className="text-base font-nunito-bold text-text-primary mb-2">Sessions Per Day</Text>
      <View className="h-[220px]">
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={['y']}
          domainPadding={{ left: 22, right: 22, top: 16, bottom: 8 }}
          axisOptions={{
            font: undefined,
            labelColor: COLORS.textMuted,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.y}
              chartBounds={chartBounds}
              color={COLORS.brand}
              roundedCorners={{ topLeft: 6, topRight: 6 }}
            />
          )}
        </CartesianChart>
      </View>
    </Card>
  );
}

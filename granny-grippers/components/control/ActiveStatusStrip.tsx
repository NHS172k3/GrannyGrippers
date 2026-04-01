import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBle } from '../../hooks/useBle';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDuration } from '../../hooks/useSessions';
import { COLORS, DARK_COLORS } from '../../constants/theme';
import { SPEED_DISPLAY } from '../../types';

export default function ActiveStatusStrip() {
  const { deviceStatus, isConnected } = useBle();
  const elapsedSeconds = useSessionStore((s) => s.elapsedSeconds);
  const activeSession  = useSessionStore((s) => s.activeSession);
  const t = useColorScheme() === 'dark' ? DARK_COLORS : COLORS;

  const anyRunning =
    (deviceStatus.mainSpeed !== null && deviceStatus.mainSpeed !== 'OFF') ||
    (deviceStatus.heelSpeed !== null && deviceStatus.heelSpeed !== 'OFF');

  if (!isConnected || !anyRunning || !activeSession) return null;

  return (
    <View
      style={{
        backgroundColor: t.brandLight,
        borderWidth: 1,
        borderColor: t.brandBorder,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.brand }} />
        <Text style={{ fontSize: 15, fontFamily: 'Nunito_700Bold', color: t.brand }}>
          Running
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {deviceStatus.mainSpeed && deviceStatus.mainSpeed !== 'OFF' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="footsteps-outline" size={15} color={t.textSecondary} />
            <Text style={{ fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: t.textSecondary }}>
              Sole: {SPEED_DISPLAY[deviceStatus.mainSpeed] ?? deviceStatus.mainSpeed}
            </Text>
          </View>
        )}

        {deviceStatus.heelSpeed && deviceStatus.heelSpeed !== 'OFF' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="walk-outline" size={15} color={t.textSecondary} />
            <Text style={{ fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: t.textSecondary }}>
              Heel: {SPEED_DISPLAY[deviceStatus.heelSpeed] ?? deviceStatus.heelSpeed}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="timer-outline" size={15} color={t.brand} />
          <Text style={{ fontSize: 15, fontFamily: 'Nunito_700Bold', color: t.brand }}>
            {formatDuration(elapsedSeconds)}
          </Text>
        </View>
      </View>
    </View>
  );
}

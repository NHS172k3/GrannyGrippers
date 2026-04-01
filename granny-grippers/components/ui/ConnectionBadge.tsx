import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { useBle } from '../../hooks/useBle';
import { COLORS, DARK_COLORS } from '../../constants/theme';

export default function ConnectionBadge() {
  const { isConnected } = useBle();
  const t = useColorScheme() === 'dark' ? DARK_COLORS : COLORS;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        backgroundColor: isConnected ? t.successLight : t.dangerLight,
        borderColor: isConnected ? t.success : t.danger,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginRight: 6,
          backgroundColor: isConnected ? t.success : t.danger,
        }}
      />
      <Text
        style={{
          fontFamily: 'Nunito_700Bold',
          fontSize: 13,
          color: isConnected ? t.success : t.danger,
        }}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
    </View>
  );
}

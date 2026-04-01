import React from 'react';
import { Alert, Pressable, Text, useColorScheme } from 'react-native';
import Card from '../ui/Card';
import { useBle } from '../../hooks/useBle';
import { clearLastDeviceId } from '../../utils/sessionStorage';
import { COLORS, DARK_COLORS } from '../../constants/theme';

export default function DangerZoneCard() {
  const { disconnect } = useBle();
  const t = useColorScheme() === 'dark' ? DARK_COLORS : COLORS;

  const handleForgetDevice = () => {
    Alert.alert(
      'Forget device',
      'This will disconnect and remove the paired device. You can pair again from Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Forget',
          style: 'destructive',
          onPress: () => {
            void disconnect();
            void clearLastDeviceId();
          },
        },
      ]
    );
  };

  return (
    <Card>
      <Text
        style={{ fontSize: 15, fontFamily: 'Nunito_700Bold', color: t.textPrimary, marginBottom: 12 }}
      >
        Device
      </Text>
      <Pressable
        onPress={handleForgetDevice}
        style={{
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          backgroundColor: t.dangerLight,
          borderWidth: 1,
          borderColor: t.danger,
        }}
      >
        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 15, color: t.danger }}>
          Forget device
        </Text>
      </Pressable>
    </Card>
  );
}

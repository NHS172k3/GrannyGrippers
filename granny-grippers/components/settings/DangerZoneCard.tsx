import React from 'react';
import { Alert, Pressable, Text } from 'react-native';
import Card from '../ui/Card';
import { useBle } from '../../hooks/useBle';
import { clearLastDeviceId } from '../../utils/sessionStorage';

export default function DangerZoneCard() {
  const { disconnect } = useBle();

  const handleFirmwareCheck = () => {
    Alert.alert('Firmware', 'Firmware update check is not connected yet.');
  };

  const handleForgetDevice = () => {
    Alert.alert('Forget device', 'This will disconnect and remove the paired device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Forget',
        style: 'destructive',
        onPress: () => {
          void disconnect();
          void clearLastDeviceId();
        },
      },
    ]);
  };

  return (
    <Card>
      <Text className="text-base font-nunito-bold text-danger mb-3">Danger Zone</Text>
      <Pressable onPress={handleFirmwareCheck} className="rounded-xl bg-brand-light border border-brand-border p-3 mb-2">
        <Text className="font-nunito-semibold text-info">Check for firmware update</Text>
      </Pressable>
      <Pressable onPress={handleForgetDevice} className="rounded-xl bg-danger-light border border-danger p-3">
        <Text className="font-nunito-semibold text-danger">Forget device</Text>
      </Pressable>
    </Card>
  );
}

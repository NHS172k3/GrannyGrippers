import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Card from '../ui/Card';
import { useBle } from '../../hooks/useBle';

interface Props {
  onConnectPress: () => void;
}

export default function DeviceInfoCard({ onConnectPress }: Readonly<Props>) {
  const { connectedDevice, isConnected, rssi } = useBle();

  return (
    <Card className="mb-4">
      <Text className="text-base font-nunito-bold text-text-primary mb-3">Paired Device</Text>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-nunito-medium text-text-secondary">Name</Text>
          <Text className="font-nunito-semibold text-text-primary">
            {connectedDevice?.name || connectedDevice?.localName || 'Not paired'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="font-nunito-medium text-text-secondary">Model</Text>
          <Text className="font-nunito-semibold text-text-primary">GG-ESP32</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="font-nunito-medium text-text-secondary">Firmware</Text>
          <Text className="font-nunito-semibold text-text-primary">v1.0.0</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="font-nunito-medium text-text-secondary">RSSI</Text>
          <Text className="font-nunito-semibold text-text-primary">
            {isConnected && typeof rssi === 'number' ? `${rssi} dBm` : '--'}
          </Text>
        </View>
      </View>

      {!isConnected && (
        <Pressable onPress={onConnectPress} className="mt-4 rounded-xl bg-brand p-3 items-center">
          <Text className="font-nunito-bold text-white">Connect Device</Text>
        </Pressable>
      )}
    </Card>
  );
}

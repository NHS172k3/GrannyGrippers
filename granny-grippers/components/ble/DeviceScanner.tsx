import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { Device } from 'react-native-ble-plx';
import Card from '../ui/Card';
import { useBle } from '../../hooks/useBle';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function DeviceScanner({ visible, onClose }: Readonly<Props>) {
  const { discoveredDevices, isScanning, connectedDevice, scan, connectToDevice } = useBle();

  const handleConnect = async (device: Device) => {
    const ok = await connectToDevice(device);
    if (ok) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-gg-bg rounded-t-3xl p-5 max-h-[82%]">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-nunito-bold text-text-primary">Scan Devices</Text>
            <Pressable onPress={onClose} className="px-3 py-1 rounded-full bg-surface-muted">
              <Text className="text-sm font-nunito-semibold text-text-secondary">Close</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              void scan();
            }}
            disabled={isScanning}
            className={`rounded-2xl p-3.5 items-center mb-4 ${
              isScanning ? 'bg-surface-muted' : 'bg-brand'
            }`}
          >
            <Text className={`font-nunito-bold ${isScanning ? 'text-text-muted' : 'text-white'}`}>
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Text>
          </Pressable>

          {isScanning && (
            <View className="flex-row items-center mb-4">
              <ActivityIndicator />
              <Text className="ml-2 text-text-secondary font-nunito-medium">
                Looking for Granny Grippers devices...
              </Text>
            </View>
          )}

          <FlatList
            data={discoveredDevices}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Card className="items-center">
                <Text className="font-nunito-medium text-text-secondary text-center">
                  No devices found yet. Start a scan and keep your cleaner nearby.
                </Text>
              </Card>
            }
            renderItem={({ item }) => {
              const isCurrent = connectedDevice?.id === item.id;
              return (
                <Card className="mb-3">
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1">
                      <Text className="font-nunito-bold text-base text-text-primary">
                        {item.name || item.localName || 'Unnamed Device'}
                      </Text>
                      <Text className="font-nunito-medium text-xs text-text-muted mt-1">
                        {item.id}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleConnect(item)}
                      disabled={isCurrent}
                      className={`px-3 py-2 rounded-xl ${
                        isCurrent ? 'bg-success-light' : 'bg-brand-light'
                      }`}
                    >
                      <Text
                        className={`font-nunito-bold ${
                          isCurrent ? 'text-success' : 'text-brand'
                        }`}
                      >
                        {isCurrent ? 'Connected' : 'Connect'}
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Device } from 'react-native-ble-plx';
import Card from '../ui/Card';
import { useBle } from '../../hooks/useBle';
import { COLORS, DARK_COLORS } from '../../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function DeviceScanner({ visible, onClose }: Readonly<Props>) {
  const { discoveredDevices, isScanning, scanError, connectedDevice, scan, connectToDevice } = useBle();
  const t = useColorScheme() === 'dark' ? DARK_COLORS : COLORS;

  const handleConnect = async (device: Device) => {
    const ok = await connectToDevice(device);
    if (ok) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(26,19,10,0.55)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: t.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            maxHeight: '82%',
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 22, fontFamily: 'Nunito_700Bold', color: t.textPrimary }}>
              Scan Devices
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: t.surfaceMuted,
              }}
            >
              <Text style={{ fontSize: 15, fontFamily: 'Nunito_700Bold', color: t.textSecondary }}>
                Close
              </Text>
            </Pressable>
          </View>

          {/* Scan button */}
          <Pressable
            onPress={() => { void scan(); }}
            disabled={isScanning}
            style={{
              borderRadius: 16,
              padding: 14,
              alignItems: 'center',
              marginBottom: 16,
              backgroundColor: isScanning ? t.surfaceMuted : t.brand,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Nunito_700Bold',
                color: isScanning ? t.textMuted : '#FFFFFF',
              }}
            >
              {isScanning ? 'Scanning…' : 'Start Scan'}
            </Text>
          </Pressable>

          {/* Scanning indicator */}
          {isScanning && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 }}>
              <ActivityIndicator color={t.brand} />
              <Text style={{ marginLeft: 12, fontSize: 15, fontFamily: 'Nunito_500Medium', color: t.textPrimary }}>
                Looking for Granny Grippers devices…
              </Text>
            </View>
          )}

          {/* Bluetooth off error */}
          {scanError && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: t.dangerLight,
                borderWidth: 1,
                borderColor: t.danger,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 16,
                gap: 12,
              }}
            >
              <Ionicons name="bluetooth-outline" size={22} color={t.danger} />
              <Text style={{ flex: 1, fontSize: 15, fontFamily: 'Nunito_600SemiBold', color: t.danger }}>
                {scanError}
              </Text>
            </View>
          )}

          {/* Device list */}
          <FlatList
            data={discoveredDevices}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Card className="items-center py-6">
                <Ionicons
                  name="bluetooth-outline"
                  size={36}
                  color={t.brand}
                  style={{ marginBottom: 10 }}
                />
                <Text style={{ fontSize: 16, fontFamily: 'Nunito_700Bold', color: t.textPrimary, textAlign: 'center', marginBottom: 4 }}>
                  No devices found yet
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'Nunito_500Medium', color: t.textSecondary, textAlign: 'center' }}>
                  Start a scan and keep your cleaner nearby.
                </Text>
              </Card>
            }
            renderItem={({ item }) => {
              const isCurrent = connectedDevice?.id === item.id;
              return (
                <Card className="mb-3">
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 17, color: t.textPrimary }}>
                        {item.name || item.localName || 'Unnamed Device'}
                      </Text>
                      <Text style={{ fontFamily: 'Nunito_500Medium', fontSize: 13, color: t.textMuted, marginTop: 2 }}>
                        {item.id}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleConnect(item)}
                      disabled={isCurrent}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: isCurrent ? t.successLight : t.brandLight,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'Nunito_700Bold',
                          color: isCurrent ? t.success : t.brand,
                        }}
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

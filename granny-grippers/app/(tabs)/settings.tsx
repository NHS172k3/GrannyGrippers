import React, { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GGHeader from '../../components/ui/GGHeader';
import DeviceInfoCard from '../../components/settings/DeviceInfoCard';
import PreferencesCard from '../../components/settings/PreferencesCard';
import DangerZoneCard from '../../components/settings/DangerZoneCard';
import DeviceScanner from '../../components/ble/DeviceScanner';

export default function SettingsTab() {
  const [scannerVisible, setScannerVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gg-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <GGHeader title="Settings" subtitle="Manage your cleaner" />
        <DeviceInfoCard onConnectPress={() => setScannerVisible(true)} />

        <Pressable
          onPress={() => setScannerVisible(true)}
          className="rounded-2xl bg-brand-light border border-brand-border p-3.5 items-center mb-4"
        >
          <Text className="font-nunito-bold text-brand">Scan for devices</Text>
        </Pressable>

        <PreferencesCard />
        <DangerZoneCard />
      </ScrollView>

      <DeviceScanner visible={scannerVisible} onClose={() => setScannerVisible(false)} />
    </SafeAreaView>
  );
}

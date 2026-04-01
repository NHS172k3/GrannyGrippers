import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GGHeader from '../../components/ui/GGHeader';
import DeviceInfoCard from '../../components/settings/DeviceInfoCard';
import PreferencesCard from '../../components/settings/PreferencesCard';
import DangerZoneCard from '../../components/settings/DangerZoneCard';
import DeviceScanner from '../../components/ble/DeviceScanner';

export default function SettingsTab() {
  const [scannerVisible, setScannerVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gg-bg dark:bg-dark-bg" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <GGHeader title="Settings" subtitle="Manage your cleaner" />
        <DeviceInfoCard onConnectPress={() => setScannerVisible(true)} />
        <PreferencesCard />
        <DangerZoneCard />
      </ScrollView>

      <DeviceScanner visible={scannerVisible} onClose={() => setScannerVisible(false)} />
    </SafeAreaView>
  );
}

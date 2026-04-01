import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GGHeader from '../../components/ui/GGHeader';
import ActiveStatusStrip from '../../components/control/ActiveStatusStrip';
import ControlGrid from '../../components/control/ControlGrid';
import DeviceScanner from '../../components/ble/DeviceScanner';

export default function ControlTab() {
  const [scannerVisible, setScannerVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gg-bg dark:bg-dark-bg" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <GGHeader title="Control" subtitle="Command your cleaner" />
        <ActiveStatusStrip />
        <ControlGrid onConnectPress={() => setScannerVisible(true)} />
      </ScrollView>

      <DeviceScanner visible={scannerVisible} onClose={() => setScannerVisible(false)} />
    </SafeAreaView>
  );
}

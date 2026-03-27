import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GGHeader from '../../components/ui/GGHeader';
import DeviceCard from '../../components/home/DeviceCard';
import QuickActions from '../../components/home/QuickActions';
import RecentSessionsList from '../../components/home/RecentSessionsList';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeTab() {
  return (
    <SafeAreaView className="flex-1 bg-gg-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <GGHeader title={getGreeting()} subtitle="Your wellness dashboard" />
        <DeviceCard />
        <QuickActions />
        <RecentSessionsList />
      </ScrollView>
    </SafeAreaView>
  );
}

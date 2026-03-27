import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GGHeader from '../../components/ui/GGHeader';
import WeeklySummaryCard from '../../components/history/WeeklySummaryCard';
import SessionBarChart from '../../components/history/SessionBarChart';
import SessionLogList from '../../components/history/SessionLogList';

export default function HistoryTab() {
  return (
    <SafeAreaView className="flex-1 bg-gg-bg">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 36 }}>
        <GGHeader title="History" subtitle="Track your sessions" />
        <WeeklySummaryCard />
        <SessionBarChart />
        <SessionLogList />
      </ScrollView>
    </SafeAreaView>
  );
}

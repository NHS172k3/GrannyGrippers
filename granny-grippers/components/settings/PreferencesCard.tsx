import React from 'react';
import { Switch, Text, View } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../constants/theme';
import { usePreferencesStore } from '../../stores/preferencesStore';

function PreferenceRow({
  label,
  description,
  value,
  onChange,
}: Readonly<{
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
}>) {
  return (
    <View className="flex-row items-center justify-between py-2.5">
      <View className="flex-1 pr-3">
        <Text className="font-nunito-semibold text-text-primary">{label}</Text>
        <Text className="text-xs font-nunito-medium text-text-muted mt-0.5">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.surfaceMuted, true: COLORS.brandLight }}
        thumbColor={value ? COLORS.brand : '#ffffff'}
      />
    </View>
  );
}

export default function PreferencesCard() {
  const autoReconnect = usePreferencesStore((s) => s.autoReconnect);
  const hapticFeedback = usePreferencesStore((s) => s.hapticFeedback);
  const sessionReminders = usePreferencesStore((s) => s.sessionReminders);
  const setPreference = usePreferencesStore((s) => s.setPreference);

  return (
    <Card className="mb-4">
      <Text className="text-base font-nunito-bold text-text-primary mb-1">Preferences</Text>
      <PreferenceRow
        label="Auto-reconnect"
        description="Reconnect automatically to your last paired cleaner"
        value={autoReconnect}
        onChange={(value) => setPreference('autoReconnect', value)}
      />
      <PreferenceRow
        label="Haptic feedback"
        description="Use tactile feedback when pressing controls"
        value={hapticFeedback}
        onChange={(value) => setPreference('hapticFeedback', value)}
      />
      <PreferenceRow
        label="Session reminders"
        description="Receive reminders to clean regularly"
        value={sessionReminders}
        onChange={(value) => setPreference('sessionReminders', value)}
      />
    </Card>
  );
}

import React from 'react';
import { Switch, Text, View } from 'react-native';
import Card from '../ui/Card';
import { useColorScheme } from 'react-native';
import { COLORS, DARK_COLORS } from '../../constants/theme';
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
  const scheme = useColorScheme();
  const t = scheme === 'dark' ? DARK_COLORS : COLORS;

  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gg-border dark:border-dark-border last:border-0">
      <View className="flex-1 pr-3">
        <Text className="font-nunito-semibold text-base text-text-primary dark:text-dark-text-primary">
          {label}
        </Text>
        <Text className="text-sm font-nunito-medium text-text-muted dark:text-dark-text-muted mt-0.5">
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: t.surfaceMuted, true: t.brandLight }}
        thumbColor={value ? t.brand : '#ffffff'}
      />
    </View>
  );
}

export default function PreferencesCard() {
  const autoReconnect    = usePreferencesStore((s) => s.autoReconnect);
  const hapticFeedback   = usePreferencesStore((s) => s.hapticFeedback);
  const sessionReminders = usePreferencesStore((s) => s.sessionReminders);
  const setPreference    = usePreferencesStore((s) => s.setPreference);

  return (
    <Card className="mb-4">
      <Text className="text-base font-nunito-bold text-text-primary dark:text-dark-text-primary mb-1">
        Preferences
      </Text>
      <PreferenceRow
        label="Auto-reconnect"
        description="Reconnect automatically when your cleaner is nearby"
        value={autoReconnect}
        onChange={(value) => setPreference('autoReconnect', value)}
      />
      <PreferenceRow
        label="Haptic feedback"
        description="Feel a tap when pressing controls"
        value={hapticFeedback}
        onChange={(value) => setPreference('hapticFeedback', value)}
      />
      <PreferenceRow
        label="Session reminders"
        description="Get reminders to use your cleaner regularly"
        value={sessionReminders}
        onChange={(value) => setPreference('sessionReminders', value)}
      />
    </Card>
  );
}

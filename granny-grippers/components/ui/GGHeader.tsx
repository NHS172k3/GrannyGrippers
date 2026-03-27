import React from 'react';
import { View, Text } from 'react-native';
import ConnectionBadge from './ConnectionBadge';

interface Props {
  title: string;
  subtitle?: string;
}

export default function GGHeader({ title, subtitle }: Readonly<Props>) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View>
        <Text className="text-2xl font-nunito-bold text-text-primary">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm font-nunito text-text-secondary mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      <ConnectionBadge />
    </View>
  );
}

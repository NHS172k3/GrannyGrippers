import React from 'react';
import { View, Text } from 'react-native';
import ConnectionBadge from './ConnectionBadge';

interface Props {
  title: string;
  subtitle?: string;
}

export default function GGHeader({ title, subtitle }: Readonly<Props>) {
  return (
    <View className="flex-row items-center justify-between mb-5">
      <View className="flex-1 mr-3">
        <Text className="text-3xl font-nunito-bold text-text-primary dark:text-dark-text-primary">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-base font-nunito-medium text-text-secondary dark:text-dark-text-secondary mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      <ConnectionBadge />
    </View>
  );
}

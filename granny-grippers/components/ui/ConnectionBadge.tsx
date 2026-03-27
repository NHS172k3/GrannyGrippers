import React from 'react';
import { View, Text } from 'react-native';
import { useBle } from '../../hooks/useBle';

export default function ConnectionBadge() {
  const { isConnected } = useBle();

  return (
    <View
      className={`flex-row items-center px-3 py-1.5 rounded-full ${
        isConnected ? 'bg-success-light' : 'bg-danger-light'
      }`}
    >
      <View
        className={`w-2 h-2 rounded-full mr-1.5 ${
          isConnected ? 'bg-success' : 'bg-danger'
        }`}
      />
      <Text
        className={`text-xs font-nunito-semibold ${
          isConnected ? 'text-success' : 'text-danger'
        }`}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
    </View>
  );
}

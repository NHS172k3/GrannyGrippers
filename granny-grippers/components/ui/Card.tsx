import React from 'react';
import { View } from 'react-native';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: Readonly<Props>) {
  return (
    <View
      className={`bg-surface rounded-2xl p-4 border border-gg-border ${className}`}
    >
      {children}
    </View>
  );
}

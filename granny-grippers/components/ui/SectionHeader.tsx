import React from 'react';
import { Text } from 'react-native';

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Readonly<Props>) {
  return (
    <Text className="text-xs font-nunito-bold uppercase tracking-widest text-text-muted mb-2 mt-4 px-1">
      {title}
    </Text>
  );
}

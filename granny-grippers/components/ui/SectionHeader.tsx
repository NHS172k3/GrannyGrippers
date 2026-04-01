import React from 'react';
import { Text } from 'react-native';

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Readonly<Props>) {
  return (
    <Text className="text-sm font-nunito-bold uppercase tracking-widest text-text-secondary dark:text-dark-text-secondary mb-2 mt-5 px-1">
      {title}
    </Text>
  );
}

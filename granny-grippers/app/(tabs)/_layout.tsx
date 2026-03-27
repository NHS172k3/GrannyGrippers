import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: {
  name: string;
  title: string;
  iconActive: TabIcon;
  iconInactive: TabIcon;
}[] = [
  { name: 'home', title: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
  { name: 'control', title: 'Control', iconActive: 'game-controller', iconInactive: 'game-controller-outline' },
  { name: 'history', title: 'History', iconActive: 'time', iconInactive: 'time-outline' },
  { name: 'settings', title: 'Settings', iconActive: 'settings-sharp', iconInactive: 'settings-outline' },
];

function TabIconRenderer({
  focused,
  color,
  size,
  iconActive,
  iconInactive,
}: Readonly<{
  focused: boolean;
  color: string;
  size: number;
  iconActive: TabIcon;
  iconInactive: TabIcon;
}>) {
  return <Ionicons name={focused ? iconActive : iconInactive} size={size} color={color} />;
}

function renderTabBarIcon(iconActive: TabIcon, iconInactive: TabIcon) {
  return ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <TabIconRenderer
      focused={focused}
      color={color}
      size={size}
      iconActive={iconActive}
      iconInactive={iconInactive}
    />
  );
}

const TAB_SCREENS = TAB_CONFIG.map((tab) => ({
  ...tab,
  options: {
    title: tab.title,
    tabBarIcon: renderTabBarIcon(tab.iconActive, tab.iconInactive),
  },
}));

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_500Medium',
          fontSize: 11,
        },
      }}
    >
      {TAB_SCREENS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={tab.options}
        />
      ))}
    </Tabs>
  );
}

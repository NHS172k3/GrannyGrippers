import React from 'react';
import { Text, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DARK_COLORS } from '../../constants/theme';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

const TAB_CONFIG: {
  name: string;
  title: string;
  iconActive: TabIcon;
  iconInactive: TabIcon;
}[] = [
  { name: 'home',     title: 'Home',     iconActive: 'home',            iconInactive: 'home-outline'            },
  { name: 'control',  title: 'Control',  iconActive: 'game-controller', iconInactive: 'game-controller-outline' },
  { name: 'history',  title: 'History',  iconActive: 'time',            iconInactive: 'time-outline'            },
  { name: 'settings', title: 'Settings', iconActive: 'settings-sharp',  iconInactive: 'settings-outline'        },
];

export default function TabLayout() {
  const isDark = useColorScheme() === 'dark';
  const t      = isDark ? DARK_COLORS : COLORS;

  const activeColor   = t.brand;
  // Hard near-black/near-white — never rely on textSecondary which is too muted
  const inactiveColor = isDark ? '#F5F0E8' : '#1A140C';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopWidth:  1,
          borderTopColor:  t.border,
          paddingTop:      6,
          paddingBottom:   6,
          marginBottom:    12,
        },
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? tab.iconActive : tab.iconInactive}
                size={26}
                color={color}
              />
            ),
            // Explicit label component so color is guaranteed — avoids tint color being
            // silently overridden by tabBarLabelStyle on some RN/Expo Router versions
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize:   12,
                  color:      focused ? activeColor : inactiveColor,
                  marginTop:  2,
                  marginBottom: 2,
                }}
              >
                {tab.title}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

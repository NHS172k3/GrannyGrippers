import React, { useCallback } from 'react';
import { Pressable, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useDeviceCommands } from '../../hooks/useDeviceCommands';
import { usePreferencesStore } from '../../stores/preferencesStore';
import { COLOR_VARIANT_MAP, COLORS, DARK_COLORS } from '../../constants/theme';
import type { ButtonDef } from '../../types';
import type { Command } from '../../constants/ble';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  button: ButtonDef;
  isActive?: boolean;
  disabled?: boolean;
}

export default function ControlButton({ button, isActive = false, disabled = false }: Readonly<Props>) {
  const { sendCommand } = useDeviceCommands();
  const hapticEnabled = usePreferencesStore((s) => s.hapticFeedback);
  const isDark = useColorScheme() === 'dark';
  const t = isDark ? DARK_COLORS : COLORS;

  const scale        = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const flashColor   = useSharedValue('transparent');
  const translateX   = useSharedValue(0);

  const variantKey = button.colorVariant;
  const iconColor = isActive
    ? (variantKey === 'brand' ? t.brand : variantKey === 'success' ? t.success : variantKey === 'danger' ? t.danger : variantKey === 'warning' ? t.warning : t.textSecondary)
    : t.textSecondary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    ...({
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      borderRadius: 16,
      backgroundColor: flashColor.value,
      opacity: flashOpacity.value,
    } as const),
  }));

  const handlePress = useCallback(async () => {
    if (disabled) return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
    const success = await sendCommand(button.command as Command);
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });

    if (success) {
      flashColor.value = `rgba(22,101,52,0.28)`;
      flashOpacity.value = withSequence(withTiming(1, { duration: 75 }), withTiming(0, { duration: 150 }));
    } else {
      flashColor.value = `rgba(185,28,28,0.28)`;
      flashOpacity.value = withSequence(withTiming(1, { duration: 75 }), withTiming(0, { duration: 150 }));
      translateX.value = withSequence(
        withTiming(-6, { duration: 50 }), withTiming(6, { duration: 50 }),
        withTiming(-4, { duration: 50 }), withTiming(4, { duration: 50 }),
        withTiming(0,  { duration: 50 })
      );
    }
  }, [disabled, hapticEnabled, button.command, sendCommand]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        animatedStyle,
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          paddingHorizontal: 8,
          borderRadius: 16,
          borderWidth: 1,
          opacity: disabled ? 0.4 : 1,
          borderColor: isActive ? t.brand : t.border,
          backgroundColor: isActive ? t.brandLight : t.surfaceMuted,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={button.label}
      accessibilityState={{ disabled, selected: isActive }}
    >
      <Animated.View style={flashStyle} />
      <Ionicons name={button.icon as any} size={26} color={iconColor} />
      <Text
        style={{
          fontFamily: 'Nunito_700Bold',
          fontSize: 13,
          marginTop: 6,
          color: isActive ? t.brand : t.textSecondary,
        }}
      >
        {button.label}
      </Text>
    </AnimatedPressable>
  );
}

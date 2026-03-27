import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
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
import { COLOR_VARIANT_MAP } from '../../constants/theme';
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

  const scale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const flashColor = useSharedValue('transparent');
  const translateX = useSharedValue(0);

  const variant = COLOR_VARIANT_MAP[button.colorVariant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    ...({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
      backgroundColor: flashColor.value,
      opacity: flashOpacity.value,
    } as const),
  }));

  const handlePress = useCallback(async () => {
    if (disabled) return;

    // Haptic feedback
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Scale animation
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });

    const success = await sendCommand(button.command as Command);

    // Restore scale
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });

    if (success) {
      // Success flash
      flashColor.value = 'rgba(78, 205, 196, 0.3)';
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 75 }),
        withTiming(0, { duration: 150 })
      );
    } else {
      // Failure shake + flash
      flashColor.value = 'rgba(255, 71, 87, 0.3)';
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 75 }),
        withTiming(0, { duration: 150 })
      );
      translateX.value = withSequence(
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [disabled, hapticEnabled, button.command, sendCommand]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={disabled}
      style={animatedStyle}
      className={`flex-1 min-w-[90px] items-center justify-center py-4 px-2 rounded-2xl border ${
        isActive
          ? 'border-brand bg-brand-light'
          : 'border-gg-border bg-surface-muted'
      } ${disabled ? 'opacity-40' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={button.label}
      accessibilityState={{ disabled, selected: isActive }}
    >
      <Animated.View style={flashStyle} />
      <Ionicons
        name={button.icon as any}
        size={28}
        color={variant.text}
      />
      <Text
        className={`text-xs font-nunito-bold mt-1.5 ${
          isActive ? 'text-brand' : 'text-text-secondary'
        }`}
      >
        {button.label}
      </Text>
    </AnimatedPressable>
  );
}

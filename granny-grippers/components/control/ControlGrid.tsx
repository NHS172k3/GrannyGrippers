import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBle } from '../../hooks/useBle';
import { BUTTON_SECTIONS, getButtonsBySection } from '../../constants/buttons';
import { COLORS } from '../../constants/theme';
import SectionHeader from '../ui/SectionHeader';
import ControlButton from './ControlButton';

interface Props {
  onConnectPress?: () => void;
}

export default function ControlGrid({ onConnectPress }: Readonly<Props>) {
  const { isConnected, deviceStatus } = useBle();

  function isButtonActive(buttonId: string): boolean {
    switch (buttonId) {
      case 'mode_scrub':
        return deviceStatus.mode === 'SCRUB';
      case 'mode_massage':
        return deviceStatus.mode === 'MASSAGE';
      case 'mode_rinse':
        return deviceStatus.mode === 'RINSE';
      case 'speed_low':
        return deviceStatus.speed === 'LOW';
      case 'speed_medium':
        return deviceStatus.speed === 'MED';
      case 'speed_high':
        return deviceStatus.speed === 'HIGH';
      case 'pump_on':
        return deviceStatus.pumpActive;
      case 'pump_off':
        return !deviceStatus.pumpActive;
      default:
        return false;
    }
  }

  const sectionLabels: Record<string, string> = {
    power: 'Power',
    mode: 'Mode',
    speed: 'Speed',
    pump: 'Pump',
  };

  return (
    <View>
      {!isConnected && (
        <Pressable
          onPress={onConnectPress}
          className="bg-brand-light border border-brand-border rounded-2xl p-4 mb-4 flex-row items-center justify-center"
        >
          <Ionicons name="bluetooth" size={20} color={COLORS.brand} />
          <Text className="text-brand font-nunito-bold ml-2">
            Connect Device
          </Text>
        </Pressable>
      )}

      {BUTTON_SECTIONS.map((section) => {
        const buttons = getButtonsBySection(section);
        return (
          <View key={section}>
            <SectionHeader title={sectionLabels[section]} />
            <View className="flex-row gap-3">
              {buttons.map((btn) => (
                <ControlButton
                  key={btn.id}
                  button={btn}
                  isActive={btn.isToggle ? isButtonActive(btn.id) : false}
                  disabled={!isConnected}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

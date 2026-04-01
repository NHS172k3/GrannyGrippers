import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBle } from '../../hooks/useBle';
import { BUTTON_SECTIONS, getButtonsBySection } from '../../constants/buttons';
import { COLORS } from '../../constants/theme';
import SectionHeader from '../ui/SectionHeader';
import ControlButton from './ControlButton';
import type { ButtonDef } from '../../types';

interface Props {
  onConnectPress?: () => void;
}

export default function ControlGrid({ onConnectPress }: Readonly<Props>) {
  const { isConnected, deviceStatus } = useBle();

  function isButtonActive(buttonId: string): boolean {
    switch (buttonId) {
      case 'sole_off':      return deviceStatus.mainSpeed === 'OFF' || deviceStatus.mainSpeed === null;
      case 'sole_gentle':   return deviceStatus.mainSpeed === 'LOW';
      case 'sole_standard': return deviceStatus.mainSpeed === 'MED';
      case 'sole_power':    return deviceStatus.mainSpeed === 'HIGH';
      case 'heel_off':      return deviceStatus.heelSpeed === 'OFF' || deviceStatus.heelSpeed === null;
      case 'heel_gentle':   return deviceStatus.heelSpeed === 'LOW';
      case 'heel_standard': return deviceStatus.heelSpeed === 'MED';
      case 'heel_power':    return deviceStatus.heelSpeed === 'HIGH';
      case 'pump_on':       return deviceStatus.pumpActive;
      case 'pump_off':      return !deviceStatus.pumpActive;
      default:              return false;
    }
  }

  const sectionLabels: Record<string, string> = {
    program: 'Programs',
    power:   'Power',
    sole:    'Sole',
    heel:    'Heel',
    pump:    'Pump',
  };

  function renderButtonRow(btns: ButtonDef[]) {
    return (
      <View className="flex-row gap-3">
        {btns.map((btn) => (
          <ControlButton
            key={btn.id}
            button={btn}
            isActive={btn.isToggle ? isButtonActive(btn.id) : false}
            disabled={!isConnected}
          />
        ))}
      </View>
    );
  }

  function renderButtons(buttons: ButtonDef[]) {
    // 4-button sections (sole/heel): explicit 2×2 grid — flex-wrap with flex-1 is unreliable in RN
    if (buttons.length === 4) {
      return (
        <View className="gap-3">
          {renderButtonRow(buttons.slice(0, 2))}
          {renderButtonRow(buttons.slice(2))}
        </View>
      );
    }
    return renderButtonRow(buttons);
  }

  return (
    <View>
      {!isConnected && (
        <Pressable
          onPress={onConnectPress}
          className="bg-brand-light dark:bg-dark-brand-light border border-brand-border rounded-2xl p-4 mb-2 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="bluetooth" size={22} color={COLORS.brand} />
          <Text className="text-base text-brand font-nunito-bold">
            Connect Device
          </Text>
        </Pressable>
      )}

      {BUTTON_SECTIONS.map((section) => {
        const buttons = getButtonsBySection(section);
        return (
          <View key={section}>
            <SectionHeader title={sectionLabels[section]} />
            {renderButtons(buttons)}
          </View>
        );
      })}
    </View>
  );
}

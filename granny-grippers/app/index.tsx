import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { isOnboarded, setOnboarded } from '../utils/sessionStorage';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    isOnboarded()
      .then((done) => {
        setShowOnboarding(!done);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-gg-bg items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!showOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View className="flex-1 bg-gg-bg px-6 pt-20 pb-10 justify-between">
      <View>
        <Text className="text-sm font-nunito-semibold uppercase tracking-widest text-brand mb-3">
          Granny Grippers
        </Text>
        <Text className="text-4xl font-nunito-bold text-text-primary leading-tight">
          Smarter foot care with one tap.
        </Text>
        <Text className="mt-4 text-base font-nunito-medium text-text-secondary leading-7">
          Pair your cleaner, choose scrub or massage modes, and keep your wellness sessions
          organized automatically.
        </Text>
      </View>

      <View>
        <View className="rounded-3xl bg-surface p-5 border border-gg-border mb-5">
          <Text className="font-nunito-bold text-text-primary mb-2">What you can do</Text>
          <Text className="font-nunito-medium text-text-secondary">- Connect and control over BLE</Text>
          <Text className="font-nunito-medium text-text-secondary">- Track sessions with weekly insights</Text>
          <Text className="font-nunito-medium text-text-secondary">- Manage preferences and device details</Text>
        </View>

        <Pressable
          onPress={() => {
            void setOnboarded(true).then(() => {
              router.replace('/(tabs)/home');
            });
          }}
          className="rounded-2xl bg-brand py-4 items-center"
        >
          <Text className="text-white font-nunito-bold text-base">Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

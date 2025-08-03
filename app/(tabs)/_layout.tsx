import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // This line ensures your custom HapticTab component is used for the tab bar buttons
        tabBarButton: (props) => <HapticTab {...props} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            // I've updated this to use your project's IconSymbol component
            <IconSymbol name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: 'Catalogue',
          tabBarIcon: ({ color, focused }) => (
            // Using the IconSymbol component for our new catalogue tab
            <IconSymbol name={focused ? 'paintbrush.fill' : 'paintbrush'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            // Using the IconSymbol component for the explore tab
            <IconSymbol name={focused ? 'sparkles' : 'sparkles'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { MessageSquare, Users, Settings, UserPlus } from 'lucide-react-native';


export default function TabLayout() {
  const { theme, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 32,
          paddingTop: 12,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="characters"
        options={{
          
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-character"
        options={{
          
          tabBarIcon: ({ color, size }) => (
            <UserPlus size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
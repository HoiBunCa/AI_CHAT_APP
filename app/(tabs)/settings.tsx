import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Star, Bell, Key, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';


export default function SettingsScreen() {
  const router = useRouter();
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleThemeToggle = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    rightElement: React.ReactNode,
    onPress?: () => void,
    delay: number = 0
  ) => (
    <Animated.View
      entering={FadeInRight.duration(400).delay(delay)}
    >
      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingLeft}>
          {icon}
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        </View>
        {rightElement}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
            APPEARANCE
          </Text>

          {renderSettingItem(
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              {isDark ? (
                <Moon size={20} color={theme.primary} />
              ) : (
                <Sun size={20} color={theme.primary} />
              )}
            </View>,
            'Dark Mode',
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />,
            undefined,
            100
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
            PREFERENCES
          </Text>

          {renderSettingItem(
            <View style={[styles.iconContainer, { backgroundColor: theme.secondary + '20' }]}>
              <Bell size={20} color={theme.secondary} />
            </View>,
            'Notifications',
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: theme.border, true: theme.secondary }}
              thumbColor="#FFFFFF"
            />,
            undefined,
            200
          )}

          {renderSettingItem(
            <View style={[styles.iconContainer, { backgroundColor: theme.accent + '20' }]}>
              <Star size={20} color={theme.accent} />
            </View>,
            'Upgrade to Premium',
            <View style={[styles.badge, { backgroundColor: theme.accent + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.accent }]}>PRO</Text>
            </View>,
            () => {},
            300
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
            ACCOUNT
          </Text>

          {renderSettingItem(
            <View style={[styles.iconContainer, { backgroundColor: theme.success + '20' }]}>
              <Key size={20} color={theme.success} />
            </View>,
            'Privacy',
            <Text style={{ color: theme.secondaryText }}>Change</Text>,
            () => {},
            400
          )}

          {renderSettingItem(
            <View style={[styles.iconContainer, { backgroundColor: theme.warning + '20' }]}>
              <HelpCircle size={20} color={theme.warning} />
            </View>,
            'Help & Support',
            <Text style={{ color: theme.secondaryText }}>Contact</Text>,
            () => {},
            500
          )}

          {renderSettingItem(
            <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
              <LogOut size={20} color={theme.error} />
            </View>,
            'Sign Out',
            null,
            () => router.replace('/(onboarding)/login'),
            600
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: theme.secondaryText }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 24,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});
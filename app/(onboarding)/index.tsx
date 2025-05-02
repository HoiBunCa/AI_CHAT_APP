import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View 
        entering={FadeIn.duration(1000)}
        exiting={FadeOut.duration(500)}
        style={styles.content}
      >
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3784424/pexels-photo-3784424.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.logo}
        />
        <Text style={[styles.title, { color: theme.primary }]}>AI Chat</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Connect with AI companions
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});
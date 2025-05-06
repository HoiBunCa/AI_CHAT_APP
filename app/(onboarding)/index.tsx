import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/(onboarding)/login'); // ✅ dùng push để animation hoạt động
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/smart.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Animated.View
        entering={FadeIn.duration(800)}
        exiting={FadeOut.duration(300)}
        style={styles.content}
      >
        <Text style={[styles.title, { color: "white" }]}>Chào mừng bạn!</Text>
        <Text style={[styles.subtitle, { color: "white" }]}>
          Đang khởi động ứng dụng...
        </Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});

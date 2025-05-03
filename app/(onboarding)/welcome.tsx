import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleStart = () => {
    // router.replace('/(onboarding)/character-select');
    router.replace('/(tabs)/characters');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          entering={FadeInDown.duration(800).delay(200)}
          style={styles.header}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome to AI Chat
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Chat with AI companions that understand you
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.duration(800).delay(400)}
          style={styles.imageContainer}
        >
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.duration(800).delay(600)}
          style={styles.featuresContainer}
        >
          <FeatureItem 
            title="Personalized Conversations" 
            description="Chat with AI companions that adapt to your personality"
            theme={theme}
          />
          <FeatureItem 
            title="Multiple Characters" 
            description="Choose from a variety of AI personalities"
            theme={theme}
          />
          <FeatureItem 
            title="Voice Messages" 
            description="Send and receive voice messages"
            theme={theme}
          />
        </Animated.View>
      </ScrollView>

      <Animated.View 
        entering={FadeInUp.duration(800).delay(800)}
        style={[styles.footer, { backgroundColor: theme.background }]}
      >
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
  theme: any;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, theme }) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIcon, { backgroundColor: theme.primary + '20' }]}>
      <View style={[styles.featureIconInner, { backgroundColor: theme.primary }]} />
    </View>
    <View style={styles.featureText}>
      <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: theme.secondaryText }]}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  featuresContainer: {
    padding: 24,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIconInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  button: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});
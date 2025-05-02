import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Heart, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInRight, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

interface Character {
  id: string;
  name: string;
  personality: string;
  imageUrl: string;
  color: string;
}

const characters: Character[] = [
  {
    id: '1',
    name: 'Emma',
    personality: 'Cheerful & Outgoing',
    imageUrl: 'https://images.pexels.com/photos/3756985/pexels-photo-3756985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Lily',
    personality: 'Thoughtful & Caring',
    imageUrl: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#8B5CF6',
  },
  {
    id: '3',
    name: 'Sophia',
    personality: 'Witty & Intelligent',
    imageUrl: 'https://images.pexels.com/photos/2773077/pexels-photo-2773077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#EC4899',
  },
  {
    id: '4',
    name: 'Mia',
    personality: 'Creative & Artistic',
    imageUrl: 'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#F97316',
  },
];

export default function CharacterSelectScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleContinue = () => {
    if (selectedCharacter) {
      router.replace('/(tabs)');
    }
  };

  const renderCharacterCard = ({ item, index }: { item: Character; index: number }) => (
    <Animated.View
      entering={FadeInRight.duration(400).delay(index * 100)}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: selectedCharacter?.id === item.id ? item.color : theme.border,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.cardTouchable}
        onPress={() => handleSelect(item)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.characterImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.cardContent}>
          <Text style={styles.characterName}>{item.name}</Text>
          <Text style={styles.characterPersonality}>{item.personality}</Text>
        </View>
        {selectedCharacter?.id === item.id && (
          <View style={[styles.selectedIndicator, { borderColor: item.color }]}>
            <Heart size={20} color={item.color} fill={item.color} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        entering={FadeIn.duration(800)}
        style={styles.header}
      >
        <Text style={[styles.title, { color: theme.text }]}>Choose Your AI Companion</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Select an AI character to start chatting with
        </Text>
      </Animated.View>

      <FlatList
        data={characters}
        renderItem={renderCharacterCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        contentContainerStyle={styles.characterList}
      />

      <Animated.View
        entering={FadeIn.duration(800).delay(400)}
        style={[styles.footer, { backgroundColor: theme.background }]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selectedCharacter ? theme.primary : theme.inputBackground,
              opacity: selectedCharacter ? 1 : 0.6,
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedCharacter}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selectedCharacter ? '#FFFFFF' : theme.secondaryText },
            ]}
          >
            Continue
          </Text>
          <ArrowRight
            size={20}
            color={selectedCharacter ? '#FFFFFF' : theme.secondaryText}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  characterList: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: 400,
    marginRight: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
  },
  cardTouchable: {
    flex: 1,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  characterName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  characterPersonality: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  footer: {
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
    marginRight: 8,
  },
});
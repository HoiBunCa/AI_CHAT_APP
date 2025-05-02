import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Lock, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getCharacters, Character } from '@/data/characters';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function CharactersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  const handleCharacterPress = (character: Character) => {
    if (character.isLocked) {
      // Show premium upgrade option
      return;
    }
    router.push(`/chat/new?characterId=${character.id}`);
  };

  const renderCharacter = ({ item, index }: { item: Character; index: number }) => (
    <Animated.View
      entering={FadeInUp.duration(400).delay(index * 100)}
      style={[
        styles.card,
        { 
          backgroundColor: theme.card,
          borderColor: item.color + '40',
        }
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleCharacterPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.personality, { color: item.color }]}>
              {item.personality}
            </Text>
          </View>
          {item.isLocked ? (
            <View style={[styles.lockBadge, { backgroundColor: theme.border }]}>
              <Lock size={16} color={theme.secondaryText} />
            </View>
          ) : null}
        </View>

        <Text style={[styles.description, { color: theme.secondaryText }]}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={[
            styles.chatButton,
            {
              backgroundColor: item.isLocked ? theme.inputBackground : item.color,
            }
          ]}
          onPress={() => handleCharacterPress(item)}
          disabled={item.isLocked}
        >
          {item.isLocked ? (
            <Text style={styles.chatButtonText}>Unlock Premium</Text>
          ) : (
            <>
              <MessageCircle size={18} color="#FFFFFF" />
              <Text style={styles.chatButtonText}>Start Chat</Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>AI Characters</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Choose an AI companion to chat with
        </Text>
      </View>

      <FlatList
        data={characters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  personality: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  chatButton: {
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Lock, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getCharacters, Character } from '@/data/characters';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface CharacterCardProps {
  item: Character;
  index: number;
  onPress: (character: Character) => void;
  theme: any;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ item, index, onPress, theme }) => (
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
    <TouchableOpacity style={styles.cardContent} onPress={() => onPress(item)} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.age, { color: theme.secondaryText }]}>{item.age}</Text>
        </View>
        <Text style={[styles.description, { color: theme.secondaryText }]} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
      </View>
      <View style={styles.interactionInfo}>
        <View style={styles.interactionItem}>
          <Text style={[styles.interactionCount, { color: item.color }]}>{item.interactionCount}</Text>
        </View>
        {!item.isLocked && (
          <View style={styles.interactionItem}>
            <MessageCircle size={16} color={theme.secondaryText} />
          </View>
        )}
        {item.isLocked && (
          <View style={[styles.lockBadge, { backgroundColor: theme.border }]}>
            <Lock size={16} color={theme.secondaryText} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  </Animated.View>
);

const CategoryButton: React.FC<{ text: string; isActive: boolean; onPress: () => void }> = ({
  text,
  isActive,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
    onPress={onPress}
  >
    <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>{text}</Text>
  </TouchableOpacity>
);

export default function CharactersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const allCharacters = getCharacters();
    setCharacters(allCharacters);
    setFilteredCharacters(allCharacters);
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredCharacters(characters);
    } else {
      // In a real app, you might have a 'category' property in your Character type
      // and filter based on that. For now, we'll just show all.
      setFilteredCharacters(characters);
    }
  }, [activeCategory, characters]);

  const handleCharacterPress = (character: Character) => {
    if (character.isLocked) {
      // Optionally show a premium upgrade modal here
      return;
    }
    router.push(`/chat/new?characterId=${character.id}`);
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
  };

  const renderCharacter = ({ item }: { item: Character }) => (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={[styles.itemContainer, { backgroundColor: theme.card, borderColor: item.color + '40' }]}
    >
      <TouchableOpacity style={styles.item} onPress={() => handleCharacterPress(item)} activeOpacity={0.9}>
        <Image source={{ uri: item.imageUrl }} style={styles.itemAvatar} />
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}, {item.age}</Text>
        <Text style={[styles.itemDescription, { color: theme.secondaryText }]} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        <View style={styles.itemInteraction}>
          <Text style={[styles.itemInteractionCount, { color: item.color }]}>{item.interactionCount}</Text>
          {!item.isLocked && <MessageCircle size={16} color={theme.secondaryText} />}
          {item.isLocked && (
            <View style={[styles.itemLockBadge, { backgroundColor: theme.border }]}>
              <Lock size={16} color={theme.secondaryText} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Characters</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
          <CategoryButton
            text="All"
            isActive={activeCategory === 'All'}
            onPress={() => handleCategoryPress('All')}
          />
          <CategoryButton
            text="Romantic"
            isActive={activeCategory === 'Romantic'}
            onPress={() => handleCategoryPress('Romantic')}
          />
          <CategoryButton
            text="New"
            isActive={activeCategory === 'New'}
            onPress={() => handleCategoryPress('New')}
          />
          <CategoryButton
            text="Crazy"
            isActive={activeCategory === 'Crazy'}
            onPress={() => handleCategoryPress('Crazy')}
          />
          <CategoryButton
            text="Cool"
            isActive={activeCategory === 'Cool'}
            onPress={() => handleCategoryPress('Cool')}
          />
          {/* Add more categories as needed */}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCharacters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryScrollView: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: '#222222',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B6B', // Example active color
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#AAAAAA',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  itemContainer: {
    flex: 0.5,
    borderRadius: 16,
    marginBottom: 16,
    padding: 8,
  },
  item: {
    alignItems: 'center',
  },
  itemAvatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  itemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#AAAAAA',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  itemInteraction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInteractionCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginRight: 4,
  },
  itemLockBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
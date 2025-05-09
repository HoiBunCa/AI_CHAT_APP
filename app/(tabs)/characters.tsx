import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Lock, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { fetchCharacters, Character } from '@/data/characters';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface CharacterCardProps {
  item: Character;
  onPress: (character: Character) => void;
  theme: any;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ item, onPress, theme }) => (
  <Animated.View
    entering={FadeInUp.duration(400)}
    style={[styles.itemContainer, { backgroundColor: theme.card, borderColor: item.color + '40' }]}
  >
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemAvatar} />
      <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.itemDescription, { color: theme.secondaryText }]} numberOfLines={2} ellipsizeMode="tail">
        {item.description}
      </Text>
      <View style={styles.itemInteraction}>
        
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
    const fetchData = async () => {
      const sessionString = await AsyncStorage.getItem('userSession');
      if (sessionString) {
        const session = JSON.parse(sessionString); // chuyển từ chuỗi sang object
        const userId = session.id; // lấy id
        console.log('User ID:', userId);
        const allCharacters = await fetchCharacters(userId);
      setCharacters(allCharacters);
      }
      
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(char => char.category.toLowerCase() === activeCategory.toLowerCase());
      setFilteredCharacters(filtered);
    }
  }, [activeCategory, characters]);

  const handleCharacterPress = (character: Character) => {
    if (character.isLocked) {
      return;
    }
    router.push(`/chat/new?characterId=${character.id}`);
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
  };

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
        </ScrollView>
      </View>

      <FlatList
        data={filteredCharacters}
        renderItem={({ item }) => <CharacterCard item={item} onPress={handleCharacterPress} theme={theme} />}
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
    backgroundColor: '#FF6B6B',
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

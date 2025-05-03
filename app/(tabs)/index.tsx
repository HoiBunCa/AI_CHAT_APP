import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Plus, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getCharacters } from '@/data/characters';
import { getRecentChats } from '@/data/chats';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { database, ref, remove  } from '../../lib/firebase';

interface Character {
  id: string;
  name: string;
  imageUrl: string;
}

interface Chat {
  id: string;
  characterId: string;
  characterName: string;
  characterImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export default function ChatsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    setCharacters(getCharacters().slice(0, 10));
    setRecentChats(getRecentChats());

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const handleOpenChat = (chatId: string, characterId: string) => {
    router.push(`/chat/${chatId}?characterId=${characterId}`);
  };

  const handleNewChat = (characterId: string) => {
    router.push(`/chat/new?characterId=${characterId}`);
  };

  const handleDeleteChat = (characterId: string, chatId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const chatRef = ref(database, `/chats/chat_character_${characterId}`);
    console.log('Deleting chat:', chatRef);
    remove(chatRef);
    setRecentChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  };

  const renderCharacter = ({ item, index }: { item: Character; index: number }) => (
    <Animated.View entering={FadeIn.duration(400).delay(index * 100)}>
      <TouchableOpacity style={styles.characterItem} onPress={() => handleNewChat(item.id)}>
        <Image source={{ uri: item.imageUrl }} style={styles.characterAvatar} />
        <Text style={[styles.characterName, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderChat = ({ item }: { item: Chat }) => {
    const renderRightActions = () => (

      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteChat(item.characterId, item.id)}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
      
    );

    return (
      <Swipeable 
        onSwipeableWillOpen={() => setIsSwiping(true)}
        onSwipeableClose={() => setIsSwiping(false)}
        renderRightActions={renderRightActions}>
        <TouchableOpacity
          disabled={isSwiping}
          style={[styles.chatItem, { borderBottomColor: theme.border }]}
          onPress={() => handleOpenChat(item.id, item.characterId)}
        >
          <Image source={{ uri: item.characterImage }} style={styles.chatAvatar} />
          {item.unread && <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]} />}
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={[styles.chatName, { color: theme.text }]}>{item.characterName}</Text>
              <Text style={[styles.chatTime, { color: theme.secondaryText }]}>
                {item.lastMessageTime}
              </Text>
            </View>
            <Text
              style={[
                styles.chatMessage,
                { color: item.unread ? theme.text : theme.secondaryText },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>AI Chat</Text>
          <TouchableOpacity
            style={[styles.premiumButton, { backgroundColor: theme.accent + '20' }]}
            onPress={() => {}}
          >
            <Star size={16} color={theme.accent} />
            <Text style={[styles.premiumText, { color: theme.accent }]}>Premium</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.charactersSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Chat</Text>
          <FlatList
            data={characters}
            renderItem={renderCharacter}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.charactersList}
          />
        </View>

        <View style={styles.chatsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Chats</Text>
          <FlatList
            data={recentChats}
            renderItem={renderChat}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatsList}
          />
        </View>

        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/characters')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  charactersSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  charactersList: {
    paddingBottom: 24,
  },
  characterItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 72,
  },
  characterAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  characterName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  chatsSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  chatsList: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  unreadBadge: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    left: 46,
    top: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  chatTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  chatMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  swipeActionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingRight: 0, // hoặc 0 nếu muốn sát hẳn
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
    borderRadius: 10,
  },
  deleteText: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
  },
});

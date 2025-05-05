import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Send, Mic, Image as ImageIcon } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getCharacterById } from '@/data/characters';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useChatStore } from '@/stores/chatStore';
import type { Message } from '@/stores/chatStore';

export default function ChatScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { id, characterId } = useLocalSearchParams<{ id: string; characterId: string }>();
  const [message, setMessage] = useState('');
  const [character, setCharacter] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    isLoading,
    error,
    initializeChat,
    sendMessage,
    clearChat
  } = useChatStore();

  useEffect(() => {
    if (!characterId) return;
  
    const fetchCharacter = async () => {
      const selectedCharacter = await getCharacterById(characterId);
      if (selectedCharacter) {
        setCharacter(selectedCharacter);
        initializeChat(selectedCharacter);
      }
    };
  
    fetchCharacter();
  
    return () => {
      // clearChat();
    };
  }, [characterId]);

  const handleSend = async () => {
    if (message.trim() === '') return;
    const currentMessage = message;
    setMessage('');
    await sendMessage(currentMessage);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <Animated.View
      entering={SlideInRight.duration(300).delay(index === messages.length - 1 ? 0 : 0)}
      style={[
        styles.messageBubble,
        item.sender === 'user'
          ? [styles.userBubble, { backgroundColor: theme.messageBubbleUser }]
          : [styles.aiBubble, { backgroundColor: theme.messageBubbleAI }],
      ]}
    >
      {item.sender === 'ai' && character && (
        <Image source={{ uri: character.imageUrl }} style={styles.avatarSmall} />
      )}
      <View style={{ flexShrink: 1 }}>
        <View style={item.sender === 'user' ? styles.userMessageContent : styles.aiMessageContent}>
          <Text
            style={[
              styles.messageText,
              {
                color:
                  item.sender === 'user'
                    ? theme.messageBubbleUserText
                    : theme.messageBubbleAIText,
              },
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              {
                color:
                  item.sender === 'user'
                    ? theme.messageBubbleUserText + '90'
                    : theme.secondaryText,
              },
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>

          {character && (
            <View style={styles.characterInfo}>
              <Image source={{ uri: character.imageUrl }} style={styles.avatar} />
              <View>
                <Text style={[styles.characterName, { color: theme.text }]}>
                  {character.name}
                </Text>
                <Text style={[styles.characterStatus, { color: theme.primary }]}>
                  {isLoading ? 'Typing...' : 'Online'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* 👇 Chat background image now corresponds to the character */}
      <ImageBackground
        source={{ uri: character?.imageUrl }}
        resizeMode="cover"
        style={styles.chatBackground}
   
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.error + '20' }]}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <Animated.View
          entering={FadeIn}
          style={[
            styles.inputContainer,
            { backgroundColor: isDark ? theme.card : theme.background },
          ]}
        >
          <BlurView
            intensity={isDark ? 20 : 100}
            tint={isDark ? 'dark' : 'light'}
            style={styles.blurContainer}
          >
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachButton}>
                <ImageIcon size={24} color={theme.secondaryText} />
              </TouchableOpacity>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: '#F1F0F0',
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Type a message..."
                placeholderTextColor={theme.secondaryText}
                value={message}
                onChangeText={setMessage}
                multiline
                editable={!isLoading}
              />

              {message.trim() === '' ? (
                <TouchableOpacity style={styles.actionButton}>
                  <Mic size={24} color={theme.primary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.primary },
                    isLoading && { opacity: 0.5 }
                  ]}
                  onPress={handleSend}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Send size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  characterName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  characterStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  chatBackground: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F0F0',
    borderBottomLeftRadius: 0,
  },
  userMessageContent: {
    alignItems: 'flex-end',
  },
  aiMessageContent: {
    alignItems: 'flex-start',
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  blurContainer: {
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});

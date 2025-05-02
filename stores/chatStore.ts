import { create } from 'zustand';
import { GeminiChat, Character } from '../lib/gemini';
import { database } from '../lib/firebase';
import { ref, push, remove, onValue, query, limitToLast, set as firebaseSet } from "firebase/database";

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  geminiChat: GeminiChat | null;
  chatId: string | null;
  initializeChat: (character: Character) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  geminiChat: null,
  chatId: null,

  initializeChat: async (character: Character) => {
    const characterId = character.id;
    const chatRef = ref(database, `chats/chat_character_${characterId}/messages`);
    const lastTenMessagesQuery = query(chatRef, limitToLast(10));
    const geminiChat = new GeminiChat(character);
    set({ geminiChat, chatId: characterId });

    onValue(lastTenMessagesQuery, (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        const messages: Message[] = Object.entries(chatData).map(([key, value]: any) => ({
          id: key,
          ...value,
        }));
        set({ messages });
      } else {
        set({ messages: [] });
      }
    });
  },

  sendMessage: async (content: string) => {
    const { geminiChat, chatId } = get();
    if (!geminiChat || !chatId) {
      set({ error: 'Chat not initialized' });
      return;
    }

    const chatRef = ref(database, `chats/chat_character_${chatId}/messages`);
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // User message
    const userMsgRef = push(chatRef);
    const userMessage: Message = {
      id: userMsgRef.key!,
      content,
      sender: 'user',
      timestamp,
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));
    await firebaseSet(userMsgRef, userMessage);

    try {
      // AI response
      const response = await geminiChat.sendMessage(content);
      const aiMsgRef = push(chatRef);
      const aiMessage: Message = {
        id: aiMsgRef.key!,
        content: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
      }));
      await firebaseSet(aiMsgRef, aiMessage);
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to get AI response',
      });
    }
  },

  clearChat: () => {
    const { chatId } = get();
    if (chatId) {
      const chatRef = ref(database, `chats/chat_character_${chatId}`);
      remove(chatRef);
    }
    set({ messages: [], error: null, geminiChat: null, chatId: null });
  },
}));

import { create } from 'zustand';
import { GeminiChat, Character } from '../lib/gemini';
import { database } from '../lib/firebase';
import { ref, push, remove } from "firebase/database";

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
  initializeChat: (character: Character) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  geminiChat: null,
  chatId: null,

  initializeChat: (character: Character) => {
    const geminiChat = new GeminiChat(character);
    const chatId = `chat_${Date.now()}`;
    set({ geminiChat, messages: [], error: null, chatId });
  },

  sendMessage: async (content: string) => {
    const { geminiChat, chatId } = get();
    if (!geminiChat || !chatId) {
      set({ error: 'Chat not initialized' });
      return;
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit',
        minute: '2-digit'
      }),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // Save user message to Firebase
      const chatRef = ref(database, `chats/${chatId}/messages`);
      push(chatRef, userMessage);

      const response = await geminiChat.sendMessage(content);

      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
      };

      // Save AI message to Firebase
      push(chatRef, aiMessage);

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: 'Failed to get AI response',
      }));
    }
  },

  clearChat: () => {
    const { chatId } = get();
    if (chatId) {
      const chatRef = ref(database, `chats/${chatId}`);
      remove(chatRef);
    }
    set({ messages: [], error: null, geminiChat: null, chatId: null });
  },
}));

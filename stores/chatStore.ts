import { create } from 'zustand';
import { GeminiChat, Character } from '@/lib/gemini';

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
  initializeChat: (character: Character) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  geminiChat: null,

  initializeChat: (character: Character) => {
    const geminiChat = new GeminiChat(character);
    set({ geminiChat, messages: [], error: null });
  },

  sendMessage: async (content: string) => {
    const { geminiChat } = get();
    if (!geminiChat) {
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
    set({ messages: [], error: null, geminiChat: null });
  },
}));
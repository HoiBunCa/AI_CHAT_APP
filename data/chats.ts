export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Chat {
  id: string;
  characterId: string;
  characterName: string;
  characterImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

const recentChats: Chat[] = [
  {
    id: 'chat1',
    characterId: '1',
    characterName: 'Emma',
    characterImage: 'https://images.pexels.com/photos/3756985/pexels-photo-3756985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'That sounds like so much fun! I\'d love to hear more about your weekend!',
    lastMessageTime: '2m ago',
    unread: true,
    messages: [
      {
        id: 'm1',
        content: 'Hi Emma! How are you today?',
        sender: 'user',
        timestamp: '10:30 AM'
      },
      {
        id: 'm2',
        content: 'Hey there! I\'m feeling fantastic today! The sun is shining and I\'m ready for a great chat. How about you?',
        sender: 'ai',
        timestamp: '10:31 AM'
      },
      {
        id: 'm3',
        content: 'I\'m doing pretty well. I had a nice weekend hiking with friends.',
        sender: 'user',
        timestamp: '10:33 AM'
      },
      {
        id: 'm4',
        content: 'That sounds like so much fun! I\'d love to hear more about your weekend!',
        sender: 'ai',
        timestamp: '10:34 AM'
      }
    ]
  },
  {
    id: 'chat2',
    characterId: '2',
    characterName: 'Lily',
    characterImage: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'It\'s completely normal to feel that way. Take your time to process your emotions.',
    lastMessageTime: '1h ago',
    unread: false,
    messages: [
      {
        id: 'm1',
        content: 'Hi Lily, I\'ve been feeling a bit down lately.',
        sender: 'user',
        timestamp: '9:15 AM'
      },
      {
        id: 'm2',
        content: 'I\'m sorry to hear that you\'re feeling down. Would you like to talk about what\'s been on your mind?',
        sender: 'ai',
        timestamp: '9:16 AM'
      },
      {
        id: 'm3',
        content: 'I\'m just feeling overwhelmed with work and personal stuff.',
        sender: 'user',
        timestamp: '9:20 AM'
      },
      {
        id: 'm4',
        content: 'It\'s completely normal to feel that way. Take your time to process your emotions.',
        sender: 'ai',
        timestamp: '9:22 AM'
      }
    ]
  },
  {
    id: 'chat3',
    characterId: '3',
    characterName: 'Sophia',
    characterImage: 'https://images.pexels.com/photos/2773077/pexels-photo-2773077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'That\'s an interesting perspective on quantum physics! Here\'s what I think...',
    lastMessageTime: 'Yesterday',
    unread: false,
    messages: [
      {
        id: 'm1',
        content: 'What do you think about quantum physics?',
        sender: 'user',
        timestamp: '4:05 PM'
      },
      {
        id: 'm2',
        content: 'That\'s a fascinating topic! Quantum physics essentially describes how particles behave at the atomic and subatomic levels. What aspect interests you most?',
        sender: 'ai',
        timestamp: '4:07 PM'
      },
      {
        id: 'm3',
        content: 'I\'ve been reading about quantum entanglement and how particles can be connected regardless of distance.',
        sender: 'user',
        timestamp: '4:10 PM'
      },
      {
        id: 'm4',
        content: 'That\'s an interesting perspective on quantum physics! Here\'s what I think...',
        sender: 'ai',
        timestamp: '4:12 PM'
      }
    ]
  }
];

export function getRecentChats(): Chat[] {
  return recentChats;
}

export function getChatById(id: string): Chat | undefined {
  return recentChats.find(chat => chat.id === id);
}
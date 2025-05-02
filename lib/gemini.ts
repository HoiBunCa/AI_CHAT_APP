import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyALmYr4M3jL1MXWSH6CVKlzmqKkfbEUJyM');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface Character {
  id: string;
  name: string;
  personality: string;
  systemPrompt: string;
}

class GeminiChat {
  private chat: ChatSession;
  private character: Character;

  constructor(character: Character) {
    this.character = character;
    this.chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [`You are ${character.name}. ${character.systemPrompt}`],
        },
        {
          role: 'model',
          parts: [`I understand. I am ${character.name} and will interact according to the given personality.`],
        },
      ],
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      throw new Error('Failed to get response from AI');
    }
  }
}

export { GeminiChat };
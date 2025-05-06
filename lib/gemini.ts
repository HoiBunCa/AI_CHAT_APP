const GEMINI_API_URL = 'https://your-google-gemini-api-endpoint'; // Địa chỉ API của Google Generative AI
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyALmYr4M3jL1MXWSH6CVKlzmqKkfbEUJyM';

export interface Character {
  id: string;
  name: string;
  personality: string;
  systemPrompt: string;
}

class GeminiChat {
  private character: Character;

  constructor(character: Character) {
    this.character = character;
  }

  async sendMessage(message: string): Promise<string> {
    const requestBody = {
      model: 'gemini-2.0-flash',
      history: [
        {
          role: 'user',
          parts: [`You are ${this.character.name}. ${this.character.systemPrompt}`],
        },
        {
          role: 'model',
          parts: [`I understand. I am ${this.character.name} and will interact according to the given personality.`],
        },
      ],
      message: message,
    };

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }

      const responseData = await response.json();
      return responseData.response.text;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      throw new Error('Failed to get response from AI');
    }
  }
}

export { GeminiChat };

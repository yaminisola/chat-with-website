import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CONFIG } from '../config/config.js';

export class ChatManager {
  constructor() {
    this.model = new ChatOpenAI({
      modelName: CONFIG.MODEL_NAME,
      temperature: 0.7,
      openAIApiKey: CONFIG.OPENAI_API_KEY
    });
  }

  async generateResponse(query, context) {
    const prompt = `
      Answer the following question based on the provided context. 
      If you cannot answer the question based on the context, say so.
      
      Context:
      ${context.map(doc => doc.pageContent).join('\n\n')}
      
      Question: ${query}
    `;

    try {
      const response = await this.model.predict(prompt);
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }
}

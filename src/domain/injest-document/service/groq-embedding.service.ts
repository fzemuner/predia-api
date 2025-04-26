import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqEmbeddingService {
  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async embedText(text: string): Promise<number[]> {
    console.log('GroqEmbeddingService.embedText | start')
    const result = await this.groq.embeddings.create({
      model: 'distil-whisper-large-v3-en',
      input: text,
    });
    console.log('GroqEmbeddingService.embedText | after embedding create')
    
    const embedding = result.data[0].embedding;
    if (typeof embedding === 'string') {
      throw new Error('Embedding returned as string. Expected number[]. Consider using a different model or decoding it.');
    }

    return embedding;
  }
}
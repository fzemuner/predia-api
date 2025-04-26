import { Injectable } from '@nestjs/common';
import OpenAIApi from 'openai';

@Injectable()
export class OpenAIEmbeddingService {
  private openai: OpenAIApi;

  constructor() {
    this.openai = new OpenAIApi({
        apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async embedText(text: string): Promise<number[]> {
    const result = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return result.data[0].embedding;
  }
}

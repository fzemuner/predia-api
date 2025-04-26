import { Injectable } from '@nestjs/common';
import * as hf from '@huggingface/inference';

@Injectable()
export class HuggingFaceEmbeddingService {
  private client = new hf.HfInference(process.env.HF_API_TOKEN);

  async embedText(text: string): Promise<number[]> {
    const response = await this.client.featureExtraction({
      model: 'jinaai/jina-embeddings-v2-base-en',
      inputs: text,
    });

    return response as number[];
  }
}

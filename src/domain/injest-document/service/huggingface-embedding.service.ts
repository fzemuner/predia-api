import { Injectable } from '@nestjs/common';
import * as hf from '@huggingface/inference';

@Injectable()
export class HuggingFaceEmbeddingService {
  private client = new hf.InferenceClient(process.env.HF_API_TOKEN);

  async embedText(text: string): Promise<number[]> {
    console.log('HuggingFaceEmbeddingService.embedText start')
    console.log(text)
    const response = await this.client.featureExtraction({
      model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',//'jinaai/jina-embeddings-v2-base-en',//'jinaai/jina-embeddings-v3',
      inputs: text,
    });
    console.log('HuggingFaceEmbeddingService.embedText end')

    return response as number[];
  }
}

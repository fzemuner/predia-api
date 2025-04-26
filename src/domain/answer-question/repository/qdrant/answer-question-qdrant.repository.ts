import { Inject, Injectable } from '@nestjs/common';
import { IAnswerQuestionRepository } from '../answer-question.repository';
import { QdrantClient } from '@qdrant/js-client-rest';
import { GroqEmbeddingService } from '../../../../domain/injest-document/service/groq-embedding.service'
import { HuggingFaceEmbeddingService } from '../../../../domain/injest-document/service/huggingface-embedding.service'

@Injectable()
export class AnswerQuestionQdrantRepository implements IAnswerQuestionRepository {
  private readonly collectionName = 'documents';

  constructor(
    @Inject('QDRANT_CLIENT') private readonly client: QdrantClient,
    private readonly embeddingService: HuggingFaceEmbeddingService
  ){}

  async searchRelevantChunks(tenantIds: string | string[], query: string): Promise<any[]> {
    console.log('AnswerQuestionQdrantRepository.searchRelevantChunks')
    const embedding = await this.embeddingService.embedText(query);
  
    const filterTenant =
      Array.isArray(tenantIds)
        ? { any: tenantIds }
        : { value: tenantIds };
  
    console.log('filterTenant', JSON.stringify(filterTenant))

    const searchResult = await this.client.search(this.collectionName, {
      vector: embedding,
      limit: 5,
      filter: {
        must: [
          {
            key: 'tenantId',
            match: filterTenant,
          },
        ],
      },
    });

    console.log('searchResult', 'payload', searchResult?.length)
  
    return searchResult.map((point) => ({
      id: point.id.toString(),
      text:
        typeof point.payload?.text === 'string'
          ? point.payload.text
          : JSON.stringify(point.payload?.text), // fallback seguro
      metadata: {
        tenantId: point.payload?.tenantId,
        ...point.payload,
      },
    }));
  }

}

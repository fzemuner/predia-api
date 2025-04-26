import { Inject, Injectable } from '@nestjs/common';
import { ISaveDocumentRepository } from '../save-document.repository';
import { QdrantClient } from '@qdrant/js-client-rest';
import { parseFileToText } from '../../../../infrastructure/util/file-parser.util';
import { OpenAIEmbeddingService } from '../../service/openai-embedding.service';
import { HuggingFaceEmbeddingService } from '../../service/huggingface-embedding.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SaveDocumentQdrantRepository implements ISaveDocumentRepository {
  

  constructor(
    @Inject('QDRANT_CLIENT') private readonly client: QdrantClient,
    private readonly embeddingService: HuggingFaceEmbeddingService
  ) {}

  async saveToVectorStore(tenantId: string, file: Express.Multer.File): Promise<void> {
    const text = await parseFileToText(file);
    const chunks = this.splitText(text, 500); // 500 tokens aprox.
    
    const points = await Promise.all(
      chunks.map(async (chunk, index) => {
        const vector = await this.embeddingService.embedText(chunk);

        return {
          id: uuidv4(),
          vector,
          payload: {
            tenantId,
            fileName: file.originalname,
            mimeType: file.mimetype,
            chunkIndex: index,
            text: chunk,
          },
        };
      }),
    );
    console.log('SaveDocumentQdrantRepository.saveToVectorStore', 'id', points[0].id, 'pointslength', points.length)

    await this.client.upsert('documents', { points });
  }

  private splitText(text: string, maxLength: number): string[] {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks: string[] = [];
    let chunk = '';

    for (const sentence of sentences) {
      if ((chunk + sentence).length > maxLength) {
        chunks.push(chunk.trim());
        chunk = sentence;
      } else {
        chunk += ' ' + sentence;
      }
    }

    if (chunk) {
      chunks.push(chunk.trim());
    }

    return chunks;
  }
}

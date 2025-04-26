import { Module } from '@nestjs/common';
import { InjestDocumentController } from './injest-document.controller';
import { InjestDocumentUseCase } from './usecase/injest-document.use-case';
import { SaveDocumentQdrantRepository } from './repository/qdrant/save-document-qdrant.repository';
import { OpenAIEmbeddingService } from './service/openai-embedding.service';
import { QdrantModule } from '../../infrastructure/database/qdrant/module/qdrant.module';
import { GroqEmbeddingService } from './service/groq-embedding.service';
import { HuggingFaceEmbeddingService } from './service/huggingface-embedding.service';

@Module({
  imports: [QdrantModule],
  controllers: [InjestDocumentController],
  providers: [
    GroqEmbeddingService,
    HuggingFaceEmbeddingService,
    OpenAIEmbeddingService,
    {
      provide: 'ISaveDocumentRepository',
      useClass: SaveDocumentQdrantRepository,
    },
    InjestDocumentUseCase,
  ],
})
export class InjestDocumentModule {}

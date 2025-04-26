import { Module } from '@nestjs/common';
import { AnswerQuestionController } from './answer-question.controller';
import { AnswerQuestionUseCase } from './usecase/answer-question.usecase';
import { AnswerQuestionQdrantRepository } from './repository/qdrant/answer-question-qdrant.repository';
import { OpenAIEmbeddingService } from '../injest-document/service/openai-embedding.service';
import { QdrantModule } from '../../infrastructure/database/qdrant/module/qdrant.module';
import { GroqEmbeddingService } from '../injest-document/service/groq-embedding.service';
import { HuggingFaceEmbeddingService } from '../injest-document/service/huggingface-embedding.service';

@Module({
  imports: [QdrantModule],
  controllers: [AnswerQuestionController],
  providers: [
    GroqEmbeddingService,
    HuggingFaceEmbeddingService,
    OpenAIEmbeddingService,
    {
      provide: 'IAnswerQuestionRepository',
      useClass: AnswerQuestionQdrantRepository,
    },
    AnswerQuestionUseCase,
  ],
})
export class AnswerQuestionModule {}

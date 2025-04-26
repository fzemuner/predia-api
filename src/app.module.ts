import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QdrantModule } from './infrastructure/database/qdrant/module/qdrant.module';
import { InjestDocumentModule } from './domain/injest-document/injest-document.module';
import { AnswerQuestionModule } from './domain/answer-question/answer-question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QdrantModule,
    AnswerQuestionModule,
    InjestDocumentModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

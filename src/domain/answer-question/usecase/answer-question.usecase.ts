import { Inject, Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';
import { Response } from 'express';
import { IAnswerQuestionRepository } from '../repository/answer-question.repository';
import { AnswerQuestionInputDto } from '../dto/answer-question.dto';
import { Usecase } from '../../usecase';

@Injectable()
export class AnswerQuestionUseCase implements Usecase<AnswerQuestionInputDto, void>{
  constructor(
    @Inject('IAnswerQuestionRepository')
    private readonly repository: IAnswerQuestionRepository
  ) {}

  async execute({tenantId, question, res}: AnswerQuestionInputDto): Promise<void> {
    console.log('execute')
    const contextChunks = await this.repository.searchRelevantChunks(tenantId, question);
    const context = contextChunks.map(c => c.text).join('\n');
    console.log('after chunks')
    await this.askLLMStream(question, context, res);
  }

  private async askLLMStream(question: string, context: string, res: Response): Promise<void> {
    const chat = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      streaming: true,
    });
    
    const messages = [
      //new SystemMessage(`Você é um assistente de dados. Use o contexto abaixo para responder:\n\n${context}`),
      new SystemMessage(`Você é um assistente útil. Sempre que for responder, use formatação em Markdown:
        - Use listas com '-'
        - Use separadores com '## Título'
        - Destaque palavras importantes com '**negrito**'
        - Use blocos de código com \`\`\`
        Responda claramente e de forma formatada. Use o contexto abaixo para responder:\n\n${context}`),
      new HumanMessage(question),
    ];

    const config: RunnableConfig = {
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            res.write(`data: ${token}\n\n`);
          },
          handleLLMEnd() {
            res.write('event: end\ndata: [DONE]\n\n');
            res.end();
          },
          handleLLMError(err: Error) {
            res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
            res.end();
          },
        },
      ],
    };

    await chat.invoke(messages, config);
  }
}
  
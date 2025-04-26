import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AnswerQuestionUseCase } from './usecase/answer-question.usecase';
import { AnswerQuestionInputDto } from './dto/answer-question.dto';

@Controller('answer-question')
export class AnswerQuestionController {
  constructor(private readonly answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body() dto: AnswerQuestionInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('controller')
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    dto.res = res;
    await this.answerQuestionUseCase.execute(dto);
  }
}

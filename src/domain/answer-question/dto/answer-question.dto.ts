import { IsNotEmpty, IsString } from 'class-validator';
import { Response } from 'express';

export class AnswerQuestionInputDto {
    @IsString()
    @IsNotEmpty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    question: string;

    res: Response
}
  
export class AnswerQuestionOutputDto {
    success: boolean;
}
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { InjestDocumentDto } from './dto/injest-document.dto';
  import { InjestDocumentUseCase } from './usecase/injest-document.use-case';
  
  @Controller('documents')
  export class InjestDocumentController {
    constructor(private readonly useCase: InjestDocumentUseCase) {}
  
    @Post('injest')
    @UseInterceptors(FileInterceptor('file'))
    async injest(
      @Body() body: InjestDocumentDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      console.log('InjestDocumentController')
      await this.useCase.execute(body.tenantId.trim(), file);
      return { status: 'OK' };
    }
  }
  
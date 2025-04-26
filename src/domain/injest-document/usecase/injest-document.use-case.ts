import { Inject, Injectable } from '@nestjs/common';
import { ISaveDocumentRepository } from '../repository/save-document.repository';

@Injectable()
export class InjestDocumentUseCase {
  constructor(
    @Inject('ISaveDocumentRepository')
    private readonly repository: ISaveDocumentRepository
  ) {}

  async execute(tenantId: string, file: Express.Multer.File): Promise<void> {
    await this.repository.saveToVectorStore(tenantId, file);
  }
}

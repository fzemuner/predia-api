import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class InjestDocumentDto {
  @IsNotEmpty()
  @IsString()
  tenantId: string;

  @Type(() => Object)
  file: Express.Multer.File;
}

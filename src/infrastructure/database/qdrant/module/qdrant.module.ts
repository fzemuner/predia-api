import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'QDRANT_CLIENT',
      useFactory: (configService: ConfigService) =>
        new QdrantClient({
          url: configService.getOrThrow<string>('QDRANT_URL'),
          apiKey: configService.get<string>('QDRANT_API_KEY'), // Optional API key
        }),
      inject: [ConfigService],
    },
  ],
  exports: [
    'QDRANT_CLIENT'
  ],
})
export class QdrantModule {}
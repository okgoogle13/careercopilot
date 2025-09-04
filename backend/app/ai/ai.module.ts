import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResumeAnalysisService } from '../services/ai/resume.service';

@Module({
  imports: [
    ConfigModule, // Make ConfigService available to AI services
  ],
  providers: [
    {
      provide: 'AI_CONFIG',
      useFactory: (configService: ConfigService) => ({
        enabled: configService.get<boolean>('ENABLE_AI_FEATURES', false),
        // Add other AI configuration here
      }),
      inject: [ConfigService],
    },
    ResumeAnalysisService,
    // Add other AI services here
  ],
  exports: [
    ResumeAnalysisService,
    // Export other AI services here
  ],
})
export class AIModule {}

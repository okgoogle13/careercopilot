import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genkit } from '@genkit-ai/core';

@Injectable()
export class BaseAIService implements OnModuleInit {
  protected readonly logger = new Logger(BaseAIService.name);
  protected isAIEnabled: boolean;
  protected isInitialized: boolean = false;

  constructor(protected readonly configService: ConfigService) {
    this.isAIEnabled = this.configService.get<boolean>('ENABLE_AI_FEATURES', false);
  }

  async onModuleInit() {
    if (this.isAIEnabled) {
      try {
        // Initialize Genkit with configuration
        genkit.configure({
          // Add your Genkit configuration here
          // Example: googleAI({ apiKey: this.configService.get('GOOGLE_AI_API_KEY') })
        });
        this.isInitialized = true;
        this.logger.log('AI Service initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize AI service', error);
        this.isAIEnabled = false;
      }
    }
  }

  /**
   * Check if AI features are available
   */
  isAvailable(): boolean {
    return this.isAIEnabled && this.isInitialized;
  }

  /**
   * Handle AI service errors consistently
   */
  protected handleError(error: Error, context: string): never {
    this.logger.error(`AI Service Error (${context}): ${error.message}`, error.stack);
    throw new Error(`AI Service Error: ${context} - ${error.message}`);
  }

  /**
   * Validate input before processing
   */
  protected validateInput(input: any, requiredFields: string[] = []): void {
    if (!input) {
      throw new Error('Input cannot be empty');
    }

    for (const field of requiredFields) {
      if (!input[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
}

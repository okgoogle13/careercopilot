import * as admin from 'firebase-admin';
import { genkit } from '@genkit-ai/core';
import { defineFlow } from '@genkit-ai/flow';
import { JobListing } from '../types/job_listing';

// Configure Genkit to use the default model
const model = genkit.model('gemini-pro');

interface JobListingEmbedding {
  title: string[];
  description: string[];
  company: string[];
  skills: string[];
  location: string[];
}

export class JobListingExtractor {
  private vectorSearch: FirebaseVectorSearch<JobListing>;
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
    this.vectorSearch = new FirebaseVectorSearch<JobListing>('job_listings');
  }

  /**
   * Extract job listing from text or URL
   */
  extract = defineFlow(
    {
      name: 'extractJobListing',
      inputSchema: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          options: {
            type: 'object',
            properties: {
              extractSkills: { type: 'boolean', default: true },
              extractSalary: { type: 'boolean', default: true },
              extractLocation: { type: 'boolean', default: true },
            },
          },
        },
      },
      outputSchema: {
        type: 'object',
        properties: {
          job: { $ref: 'JobListing' },
          metadata: { type: 'object' },
        },
      },
    },
    async ({
      source,
      options = { extractSkills: true, extractSalary: true, extractLocation: true },
    }) => {
      const text = typeof source === 'string' ? source : await this.fetchUrl(source.url);
      
      // Basic job listing extraction
      const jobListing: JobListing = {
        id: this.generateId(),
        title: this.extractTitle(text),
        company: this.extractCompany(text),
        description: text,
        skills: options.extractSkills ? this.extractSkills(text) : [],
        salary: options.extractSalary ? this.extractSalary(text) : undefined,
        location: options.extractLocation ? this.extractLocation(text) : undefined,
        source: typeof source === 'string' ? 'text' : source.url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Generate and store embedding
      const embedding = await this.generateEmbedding(jobListing);
      await this.vectorSearch.upsert(jobListing.id, embedding, jobListing);

      return jobListing;
    }
  )

  /**
   * Find similar job listings
   */
  async findSimilar(
    data: {
      query: string | JobListing;
      limit?: number;
      minScore?: number;
      filters?: Record<string, any>;
    }
  ): Promise<Array<{ job: JobListing; score: number }>> {
    // Use Genkit's semantic search
    const queryEmbedding = await this.generateEmbedding({
      title: typeof data.query === 'string' ? data.query : data.query.title || '',
      description: typeof data.query === 'string' ? data.query : data.query.description || '',
      company: typeof data.query === 'string' ? '' : data.query.company || '',
    });

    const results = await this.vectorSearch.search(embedding, options);
    return results.map(({ id, score, metadata }) => ({
      job: metadata,
      score,
    }));
  }

  private async fetchUrl(url: string): Promise<string> {
    // Implement URL fetching logic here
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${url}`);
    }
    return response.text();
  }

  private extractTitle(text: string): string {
    // Simple title extraction - can be enhanced with NLP
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines[0] || 'Untitled Position';
  }

  private extractCompany(text: string): string {
    // Simple company extraction - can be enhanced with NLP
    const companyRegex = /(?:at|from|by)\s+([A-Z][a-zA-Z0-9\s&,.]+?)(?:,|\n|$)/i;
    const match = text.match(companyRegex);
    return match ? match[1].trim() : 'Unknown Company';
  }

  private extractSkills(text: string): string[] {
    // Simple skill extraction - can be enhanced with NLP
    const skills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'Java', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'NoSQL'
    ];
    
    return skills.filter(skill => 
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );
  }

  private extractSalary(text: string): { min?: number; max?: number; currency?: string } | undefined {
    // Simple salary extraction - can be enhanced with NLP
    const salaryRegex = /\$([0-9,]+)(?:\s*-\s*\$?([0-9,]+))?/;
    const match = text.match(salaryRegex);
    
    if (!match) return undefined;
    
    return {
      min: parseInt(match[1].replace(/,/g, '')),
      max: match[2] ? parseInt(match[2].replace(/,/g, '')) : undefined,
      currency: '$'
    };
  }

  private extractLocation(text: string): string | undefined {
    // Simple location extraction - can be enhanced with NLP
    const locationRegex = /(remote|hybrid|onsite|in[-\s]?office)/i;
    const match = text.match(locationRegex);
    return match ? match[0] : undefined;
  }

  private async generateEmbedding(job: { title: string; description: string; company?: string }): Promise<number[]> {
    const text = `${job.title} ${job.company || ''} ${job.description}`.trim();
    
    // Use Genkit to generate embeddings
    const response = await model.embed({
      content: text,
      taskType: 'retrieval_document',
    });
    
    return response.embedding;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private normalizeVector(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;
    return vector.map(val => val / norm);
  }

  private generateId(): string {
    return this.db.collection('_').doc().id;
  }
}

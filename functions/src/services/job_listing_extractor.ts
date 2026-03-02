// @ts-expect-error - TS2497: esModuleInterop is enabled, but TypeScript 5.9 still complains about namespace import
import * as admin from "firebase-admin";
import * as firebase from "firebase-admin/firestore";
import {JobListing} from "../types/job_listing";
import {FirebaseVectorSearch} from "../lib/firebase_vector_search";
import https from "https";

export class JobListingExtractor {
  private vectorSearch: FirebaseVectorSearch<JobListing>;
  private db: firebase.Firestore;

  constructor() {
    this.db = admin.firestore();
    this.vectorSearch = new FirebaseVectorSearch<JobListing>("job_listings");
  }

  /**
   * Extract job listing from text or URL
   */
  async extract(data: {
    source: string | { url: string };
    options?: {
      extractSkills?: boolean;
      extractSalary?: boolean;
      extractLocation?: boolean;
    };
  }): Promise<JobListing> {
    const {source, options = {extractSkills: true, extractSalary: true, extractLocation: true}} = data;
    const text = typeof source === "string" ? source : await this.fetchUrl(source.url);

    // Basic job listing extraction
    const jobListing: JobListing = {
      id: this.generateId(),
      title: this.extractTitle(text),
      company: this.extractCompany(text),
      description: text,
      skills: options.extractSkills ? this.extractSkills(text) : [],
      salary: options.extractSalary ? this.extractSalary(text) : undefined,
      location: options.extractLocation ? this.extractLocation(text) : undefined,
      source: typeof source === "string" ? "text" : source.url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Generate and store embedding
    const embedding = await this.generateEmbedding(jobListing);
    await this.vectorSearch.upsert(jobListing.id, embedding, jobListing);

    return jobListing;
  }

  /**
   * Find similar job listings
   */
  async findSimilar(data: {
    query: string | JobListing;
    limit?: number;
    minScore?: number;
    filters?: Record<string, unknown>;
  }): Promise<Array<{ job: JobListing; score: number }>> {
    // Use Genkit's semantic search
    const queryEmbedding = await this.generateEmbedding({
      title: typeof data.query === "string" ? data.query : data.query.title || "",
      description: typeof data.query === "string" ? data.query : data.query.description || "",
      company: typeof data.query === "string" ? "" : data.query.company || "",
    });

    const results = await this.vectorSearch.search(queryEmbedding, {
      limit: data.limit,
      minScore: data.minScore,
      filters: data.filters,
    });
    return results.map(({id: _id, score, metadata}) => ({
      job: metadata,
      score,
    }));
  }

  private async fetchUrl(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      https
        .get(url, (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            // Follow simple redirects
            return this.fetchUrl(res.headers.location).then(resolve).catch(reject);
          }
          if (!res.statusCode || res.statusCode >= 400) {
            reject(
              new Error(`Failed to fetch URL: ${url} (status: ${res.statusCode || "unknown"})`),
            );
            return;
          }
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
          res.on("error", reject);
        })
        .on("error", reject);
    });
  }

  private extractTitle(text: string): string {
    // Simple title extraction - can be enhanced with NLP
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    return lines[0] || "Untitled Position";
  }

  private extractCompany(text: string): string {
    // Simple company extraction - can be enhanced with NLP
    const companyRegex = /(?:at|from|by)\s+([A-Z][a-zA-Z0-9\s&,.]+?)(?:,|\n|$)/i;
    const match = text.match(companyRegex);
    return match ? match[1].trim() : "Unknown Company";
  }

  private extractSkills(text: string): string[] {
    // Simple skill extraction - can be enhanced with NLP
    const skills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "AWS",
      "Docker",
      "Kubernetes",
      "SQL",
      "NoSQL",
    ];

    return skills.filter((skill) => new RegExp(`\\b${skill}\\b`, "i").test(text));
  }

  private extractSalary(
    text: string,
  ): { min?: number; max?: number; currency?: string } | undefined {
    // Simple salary extraction - can be enhanced with NLP
    const salaryRegex = /\$([0-9,]+)(?:\s*-\s*\$?([0-9,]+))?/;
    const match = text.match(salaryRegex);

    if (!match) return undefined;

    return {
      min: parseInt(match[1].replace(/,/g, "")),
      max: match[2] ? parseInt(match[2].replace(/,/g, "")) : undefined,
      currency: "$",
    };
  }

  private extractLocation(text: string): string | undefined {
    // Simple location extraction - can be enhanced with NLP
    const locationRegex = /(remote|hybrid|onsite|in[-\s]?office)/i;
    const match = text.match(locationRegex);
    return match ? match[0] : undefined;
  }

  private async generateEmbedding(job: {
    title: string;
    description: string;
    company?: string;
  }): Promise<number[]> {
    const text = `${job.title} ${job.company || ""} ${job.description}`.trim();

    // Simple hash-based embedding (for deployment unblocking)
    // TODO: Replace with proper embedding model (Vertex AI, OpenAI, etc.)
    const hash = this.hashString(text);
    const vector: number[] = [];
    for (let i = 0; i < 384; i++) {
      vector.push(((hash + i) % 1000) / 1000);
    }
    return this.normalizeVector(vector);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private normalizeVector(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;
    return vector.map((val) => val / norm);
  }

  private generateId(): string {
    return this.db.collection("_").doc().id;
  }
}

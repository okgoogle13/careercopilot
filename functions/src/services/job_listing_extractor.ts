aimport admin from "firebase-admin";
import {z} from "genkit";
import https from "https";
import {ai} from "../genkit";
import {FirebaseVectorSearch} from "../lib/firebase_vector_search";
import {JobListing} from "../types/job_listing";

export class JobListingExtractor {
  private vectorSearch: FirebaseVectorSearch<JobListing>;
  private db = admin.firestore();

  constructor() {
    this.db = admin.firestore();
    this.vectorSearch = new FirebaseVectorSearch<JobListing>("job_listings");
  }

  /**
   * Extract job listing data from a source (text or URL)
   */
  extract = ai.defineFlow(
    {
      name: "extractJobListing",
      inputSchema: z.object({
        source: z.union([z.string(), z.object({url: z.string()})]),
        options: z
          .object({
            extractSkills: z.boolean().default(true),
            extractSalary: z.boolean().default(true),
            extractLocation: z.boolean().default(true),
          })
          .optional(),
      }),
      outputSchema: z.object({
        id: z.string(),
        title: z.string(),
        company: z.string(),
        description: z.string(),
        skills: z.array(z.string()),
        salary: z
          .object({
            min: z.number().optional(),
            max: z.number().optional(),
            currency: z.string().optional(),
          })
          .optional(),
        location: z.string().optional(),
        source: z.union([z.string(), z.string()]), // Simplified for now
        createdAt: z.any(), // Timestamp type handling can be tricky with Zod/Genkit
      }),
    },
    async (input) => {
      // Cast input to expected type since inference might be failing
      const typedInput = input as {
        source: string | { url: string };
        options?: {
          extractSkills: boolean;
          extractSalary: boolean;
          extractLocation: boolean;
        };
      };

      const {
        source,
        options = {extractSkills: true, extractSalary: true, extractLocation: true},
      } = typedInput;
      const text = typeof source === "string" ? source : await this.fetchUrl(source.url);

      // Basic job listing extraction
      const jobListing: JobListing = {
        id: this.generateId(),
        title: this.extractTitle(text),
        company: this.extractCompany(text),
        description: text,
        skills: options?.extractSkills ? this.extractSkills(text) : [],
        salary: options?.extractSalary ? this.extractSalary(text) : undefined,
        location: options?.extractLocation ? this.extractLocation(text) : undefined,
        source: typeof source === "string" ? "text" : source.url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Generate and store embedding
      const embedding = await this.generateEmbedding(jobListing);
      await this.vectorSearch.upsert(jobListing.id, embedding, jobListing);

      return jobListing;
    },
  );

  /**
   * Find similar job listings
   */
  async findSimilar(data: {
    query: string | JobListing | Record<string, unknown>;
    limit?: number;
    minScore?: number;
    filters?: Record<string, unknown>;
  }): Promise<Array<{ job: JobListing; score: number }>> {
    // Use Genkit's semantic search
    const queryEmbedding = await this.generateEmbedding({
      title: typeof data.query === "string" ? data.query : (data.query as any).title || "",
      description:
        typeof data.query === "string" ? data.query : (data.query as any).description || "",
      company: typeof data.query === "string" ? "" : (data.query as any).company || "",
    });

    const results = await this.vectorSearch.search(queryEmbedding, {
      limit: data.limit,
      minScore: data.minScore,
      filters: data.filters,
    });
    return results.map(
      ({id: _id, score, metadata}: { id: string; score: number; metadata: JobListing }) => ({
        job: metadata,
        score,
      }),
    );
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

    // Use Genkit to generate embeddings
    const response = await ai.embed({
      embedder: "gemini-1.5-flash",
      content: text,
      // taskType: "retrieval_document", // might be optional or different in v1
    });

    return response[0].embedding;
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

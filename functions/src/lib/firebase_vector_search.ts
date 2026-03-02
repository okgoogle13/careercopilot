// @ts-expect-error - TS2497: esModuleInterop is enabled, but TypeScript 5.9 still complains about namespace import
import * as admin from 'firebase-admin';

/**
 * FirebaseVectorSearch
 *
 * Stores embeddings + metadata in Firestore and performs in-memory cosine
 * similarity search at query time.
 *
 * Storage layout:
 *   vectorStore/{collectionName}/entries/{id}
 *     → { id, embedding: number[], metadata: T, updatedAt: number }
 *
 * Suitable for collections up to ~5,000 documents. For larger datasets,
 * migrate to Vertex AI Matching Engine or Firestore's native vector search.
 */
export class FirebaseVectorSearch<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private entriesRef() {
    return admin
      .firestore()
      .collection('vectorStore')
      .doc(this.collectionName)
      .collection('entries');
  }

  /**
   * Cosine similarity between two vectors (range: -1 → 1, higher = more similar).
   * Returns 0 if either vector has zero magnitude.
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    const denominator = Math.sqrt(magA) * Math.sqrt(magB);
    return denominator === 0 ? 0 : dot / denominator;
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Store or update an embedding and its associated metadata.
   */
  async upsert(id: string, embedding: number[], metadata: T): Promise<void> {
    await this.entriesRef().doc(id).set(
      {
        id,
        embedding,
        metadata,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  }

  /**
   * Find the most similar entries to the given query embedding.
   *
   * @param queryEmbedding - The embedding vector to compare against
   * @param options.limit   - Maximum results to return (default: 5)
   * @param options.minScore - Minimum cosine similarity threshold (default: 0.5)
   * @param options.filters - Firestore equality filters applied before scoring
   *                          e.g. { status: 'active', location: 'remote' }
   */
  async search(
    queryEmbedding: number[],
    options: {
      limit?: number;
      minScore?: number;
      filters?: Record<string, unknown>;
    } = {}
  ): Promise<Array<{ id: string; score: number; metadata: T }>> {
    const { limit = 5, minScore = 0.5, filters = {} } = options;

    // Build the base query — apply equality filters from caller
    let query: admin.firestore.Query = this.entriesRef();
    for (const [field, value] of Object.entries(filters)) {
      query = query.where(`metadata.${field}`, '==', value);
    }

    const snapshot = await query.get();
    if (snapshot.empty) return [];

    // Score every entry and filter under minScore
    const scored = snapshot.docs
      .map((doc) => {
        const data = doc.data() as {
          id: string;
          embedding: number[];
          metadata: T;
        };
        return {
          id: data.id,
          score: this.cosineSimilarity(queryEmbedding, data.embedding),
          metadata: data.metadata,
        };
      })
      .filter((entry) => entry.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored;
  }

  /**
   * Delete a stored embedding by ID.
   */
  async delete(id: string): Promise<void> {
    await this.entriesRef().doc(id).delete();
  }
}

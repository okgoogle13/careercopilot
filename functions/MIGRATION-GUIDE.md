# Migration from Vertex AI to Firebase AI

This guide documents the migration from Google Cloud Vertex AI to Firebase AI for the CareerCopilot application.

## Changes Made

1. **Removed Dependencies**
   - Removed `@genkit-ai/googleai`
   - Removed Vertex AI client libraries

2. **Added Dependencies**
   - Added `firebase-ai` for AI capabilities
   - Added `numpy` and `scikit-learn` for vector operations

3. **New Components**
   - `FirebaseVectorSearch`: A class for vector similarity search using Firestore
   - `JobListingExtractor`: Service for extracting and processing job listings
   - New Cloud Functions for job listing extraction and search

4. **Data Model**
   - Job listings are now stored in Firestore with vector embeddings
   - Added support for semantic search and similarity matching

## Usage

### Extracting Job Listings

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const extractJobListing = httpsCallable(functions, 'extractJobListing');

// Extract from text
const result = await extractJobListing({
  source: 'Job Title at Company\nDescription...',
});

// Or from URL
const result = await extractJobListing({
  source: { url: 'https://example.com/job-posting' },
});
```

### Finding Similar Listings

```typescript
const findSimilarListings = httpsCallable(functions, 'findSimilarListings');

const results = await findSimilarListings({
  query: 'Software Engineer position',
  limit: 5,
  minScore: 0.7,
  filters: {
    'metadata.jobType': 'full-time',
    'metadata.isRemote': true
  }
});
```

## Performance Considerations

1. **Vector Search**
   - The current implementation uses brute-force cosine similarity
   - For production with large datasets, consider using a dedicated vector database

2. **Embedding Generation**
   - The current implementation uses a simple bag-of-words approach
   - For better results, consider using a pre-trained sentence transformer model

## Next Steps

1. **Testing**
   - Add unit tests for the new components
   - Test with real-world job listings
   - Monitor performance and accuracy

2. **Optimization**
   - Implement caching for frequent queries
   - Consider batch processing for large imports
   - Add rate limiting to the API endpoints

3. **Monitoring**
   - Set up Firebase Monitoring for the new functions
   - Track usage metrics and performance
   - Set up alerts for errors and performance issues

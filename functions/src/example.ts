import {logger} from 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';
import {setGlobalOptions} from 'firebase-functions/v2/options';
import {defineString, defineSecret} from 'firebase-functions/params';

// Define parameters using the params subpackage
const region = defineString('REGION', {default: 'us-central1'});
const apiKeySecret = defineSecret('API_KEY');
const databaseUrlSecret = defineSecret('DATABASE_URL');

// Set the region and other global options using params
setGlobalOptions({
  region: region.value(),
});

/**
 * Example function demonstrating secret management
 * @param {import('firebase-functions/v2/https').Request} req - The request object
 * @param {import('express').Response} res - The response object
 */
export const exampleFunction = onRequest({
  secrets: [apiKeySecret, databaseUrlSecret]
}, async (req, res) => {
  try {
    // Get secrets using params subpackage
    const apiKey = apiKeySecret.value();
    const databaseUrl = databaseUrlSecret.value();

    // Use the secrets (in a real app, you'd use these values in your logic)
    logger.log('Successfully retrieved secrets');

    // Don't log actual secret values in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Key:', apiKey);
      console.log('Database URL:', databaseUrl);
    }

    res.status(200).json({
      success: true,
      message: 'Secrets retrieved successfully using params subpackage',
      // Don't send secrets in the response
      hasApiKey: !!apiKey,
      hasDatabaseUrl: !!databaseUrl
    });

  } catch (error) {
    console.error('Error in exampleFunction:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      // Only include error details in development
      ...(process.env.NODE_ENV !== 'production' && {
        details: error instanceof Error ? error.message : String(error)
      })
    });
  }
});

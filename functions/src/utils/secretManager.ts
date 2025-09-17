import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Initialize the Secret Manager client
const client = new SecretManagerServiceClient();

/**
 * Retrieves a secret from Google Cloud Secret Manager
 * @param secretName The name of the secret to retrieve (without the full path)
 * @returns The secret value as a string
 */
export async function getSecret(secretName: string): Promise<string> {
  try {
    const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
    if (!projectId) {
      throw new Error("GCLOUD_PROJECT environment variable is not set");
    }

    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });

    if (!version.payload || !version.payload.data) {
      throw new Error(`No payload data found for secret: ${secretName}`);
    }

    // Handle both string and Buffer data
    const data = version.payload.data;
    if (Buffer.isBuffer(data)) {
      return data.toString("utf8");
    } else if (typeof data === "string") {
      return data;
    } else if (data instanceof Uint8Array) {
      return new TextDecoder().decode(data);
    }
    return String(data);
  } catch (error) {
    console.error(`Error accessing secret ${secretName}:`, error);
    throw error;
  }
}

/**
 * Retrieves multiple secrets in parallel
 * @param secretNames Array of secret names to retrieve
 * @returns Object with secret names as keys and their values
 */
export async function getSecrets<T extends string>(
  secretNames: readonly T[],
): Promise<{ [K in T]: string }> {
  const secretPromises = secretNames.map(async (name) => {
    const value = await getSecret(name);
    return { name, value };
  });

  const results = await Promise.all(secretPromises);
  return results.reduce(
    (acc, { name, value }) => {
      acc[name as T] = value;
      return acc;
    },
    {} as { [K in T]: string },
  );
}

// Example usage:
// const { API_KEY, DATABASE_URL } = await getSecrets(['API_KEY', 'DATABASE_URL'] as const);

// Firebase Configuration Test Utility
// Use this to validate Firebase configuration in development

export interface ConfigTestResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

export function testFirebaseConfig(): ConfigTestResult {
  try {
    // Import the configuration
    const config = import.meta.env;
    
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN', 
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    // Check for missing variables
    const missingVars = requiredVars.filter(varName => !config[varName]);
    if (missingVars.length > 0) {
      return {
        success: false,
        message: `Missing environment variables: ${missingVars.join(', ')}`,
        details: { missingVars, availableVars: Object.keys(config).filter(k => k.startsWith('VITE_')) }
      };
    }

    // Check for demo/placeholder values
    const demoPatterns = ['demo', 'test', 'placeholder', 'your-', 'default', 'example'];
    const invalidVars = requiredVars.filter(varName => {
      const value = config[varName]?.toLowerCase() || '';
      return demoPatterns.some(pattern => value.includes(pattern));
    });

    if (invalidVars.length > 0) {
      return {
        success: false,
        message: `Demo/placeholder values detected in: ${invalidVars.join(', ')}`,
        details: { invalidVars }
      };
    }

    // Validate API key format
    const apiKey = config.VITE_FIREBASE_API_KEY;
    if (!apiKey?.startsWith('AIzaSy') || apiKey.length < 35) {
      return {
        success: false,
        message: 'Invalid Firebase API key format',
        details: { 
          apiKeyFormat: 'Should start with "AIzaSy" and be ~39 characters',
          currentLength: apiKey?.length || 0
        }
      };
    }

    // Validate project ID format  
    const projectId = config.VITE_FIREBASE_PROJECT_ID;
    if (!projectId?.match(/^[a-z0-9-]+$/)) {
      return {
        success: false,
        message: 'Invalid project ID format',
        details: { 
          projectIdFormat: 'Should contain only lowercase letters, numbers, and hyphens',
          currentValue: projectId
        }
      };
    }

    // All validations passed
    return {
      success: true,
      message: 'Firebase configuration is valid',
      details: {
        projectId: config.VITE_FIREBASE_PROJECT_ID,
        authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
        hasValidApiKey: true,
        configuredServices: ['Auth', 'Firestore', 'Storage']
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `Configuration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error }
    };
  }
}

// Development helper function
export function logConfigTest(): void {
  const result = testFirebaseConfig();
  
  if (result.success) {
    console.log('✅ Firebase Configuration Test Passed');
    console.log(result.message);
    console.table(result.details);
  } else {
    console.error('❌ Firebase Configuration Test Failed');
    console.error(result.message);
    console.table(result.details);
  }
}

// Environment validation for development
if (import.meta.env.DEV) {
  logConfigTest();
}
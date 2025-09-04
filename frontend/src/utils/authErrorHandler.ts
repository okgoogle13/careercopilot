export class AuthError extends Error {
  type: 'google' | 'email' | 'general';
  code?: string;

  constructor(message: string, type: 'google' | 'email' | 'general' = 'general', code?: string) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
}

export const handleAuthError = (error: unknown): string => {
  console.error('Authentication error:', error);

  if (error instanceof AuthError) {
    return error.message;
  }

  const err = error as { code?: string; message?: string };

  switch (err.code) {
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site or try a different sign-in method.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please sign in or use a different email.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.';
    default:
      return err.message || 'An unexpected error occurred. Please try again.';
  }
};

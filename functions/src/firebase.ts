import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export initialized services
export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();

export default admin;

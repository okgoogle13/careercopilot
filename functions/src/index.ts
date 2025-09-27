/**
 * @file The main entry point for all Firebase Functions in this project.
 *
 * This file acts as an aggregator for all cloud function definitions. It imports
 * functions from their respective modules and re-exports them. This is the file
 * that the Firebase CLI reads to deploy the functions.
 *
 * By centralizing exports here, we can maintain a clean and organized structure,
 * with individual function logic separated into different files based on their domain.
 */

// Import all functions from their respective modules.
import { cleanupUserData, adminCleanupUser } from "./auth.functions";

// Export all imported functions so they can be deployed by Firebase.
export { cleanupUserData, adminCleanupUser };

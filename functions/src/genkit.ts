import { genkit } from "genkit";

// Initialize the Genkit instance
export const ai = genkit({
  plugins: [],
  model: "gemini-1.5-flash", // Default model, can be overridden
});

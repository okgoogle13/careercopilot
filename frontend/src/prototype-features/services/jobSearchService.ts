/* eslint-disable */
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const searchJobs = async (
  query: string
): Promise<{ title: string; company: string; url: string; snippet: string }[]> => {
  const prompt = `Search for job postings matching: "${query}".
    Return a JSON array of objects with title, company, url, and snippet.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      tools: [{ googleSearch: {} }],
    },
  });

  return JSON.parse(response.text || '[]');
};

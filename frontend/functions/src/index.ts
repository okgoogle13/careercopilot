import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Zod schema for resume validation
const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    linkedin: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  }),
  workExperience: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().or(z.literal("Present")),
      responsibilities: z.array(z.string()),
      achievements: z.array(z.string()).optional(),
      skillsUsed: z.array(z.string()).optional(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string(),
      gpa: z.string().optional(),
      achievements: z.array(z.string()).optional(),
    })
  ),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
  }),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      url: z.string().url().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      dateEarned: z.string(),
      expirationDate: z.string().optional(),
      credentialId: z.string().optional(),
      credentialUrl: z.string().url().optional(),
    })
  ).optional(),
});

type ResumeData = z.infer<typeof resumeSchema>;

async function extractAndStructureData(bucket: any, name: string, userId: string, fileId: string): Promise<ResumeData> {
  // Download the file from Storage and extract its raw text.
  const file = bucket.file(name);
  const [fileContent] = await file.download();
  const rawText = fileContent.toString('utf-8');

  // Defines a detailed prompt for the Gemini API
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `
  You are an expert resume parser. Extract the following information from the resume and return it as a JSON object.
  The JSON object must match the following Zod schema:
  ${JSON.stringify(resumeSchema.shape, null, 2)}

  Here's the resume text to parse:
  ${rawText}
  `;

  // Calls the Gemini API with the raw text and the prompt.
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parses the Gemini API's JSON response.
  const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || [null, text];
  const jsonString = jsonMatch[1] || text;
  
  return JSON.parse(jsonString);
}

// Main Cloud Function
export const processUploadedResume = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const bucketName = object.bucket;
  const bucket = storage.bucket(bucketName);

  // Only process files in the uploads/ folder
  if (!filePath || !filePath.startsWith('uploads/')) {
    console.log('Skipping file not in uploads folder:', filePath);
    return null;
  }

  // Extract userId and fileId from path
  const pathParts = filePath.split('/');
  if (pathParts.length < 3) {
    console.error('Invalid file path format:', filePath);
    return null;
  }

  const userId = pathParts[1];
  const fileId = pathParts[2].split('.')[0];
  const docRef = db.collection('ingestedResumes').doc(fileId);

  try {
    const structuredData = await extractAndStructureData(bucket, filePath, userId, fileId);

    const validationResult = resumeSchema.safeParse(structuredData);

    if (!validationResult.success) {
      await docRef.set({
        status: 'failed',
        error: validationResult.error.flatten(),
        userId,
        originalPath: filePath,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await docRef.set({
        status: 'pending_review',
        resumeData: validationResult.data,
        userId,
        originalPath: filePath,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log(`Successfully processed resume ${fileId} for user ${userId}`);
    return null;
  } catch (error) {
    console.error(`Error processing resume ${fileId}:`, error);
    
    await docRef.set({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    return null;
  }
});

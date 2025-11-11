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

// Helper function to extract text from file
async function extractTextFromFile(bucket: any, filePath: string): Promise<string> {
  const file = bucket.file(filePath);
  const [fileContent] = await file.download();
  // For PDFs, you might want to use a library like pdf-parse
  // For simplicity, we'll assume it's a text file for now
  return fileContent.toString('utf-8');
}

// AI processing function
async function structureResumeWithAI(rawText: string): Promise<ResumeData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
  You are an expert resume parser. Extract the following information from the resume and return it as a JSON object.
  
  Required fields:
  - personalInfo: Object containing name, email, phone, location, summary, linkedin, portfolio
  - workExperience: Array of work experiences with jobTitle, company, location, startDate, endDate, responsibilities, achievements, skillsUsed
  - education: Array of education entries with institution, degree, fieldOfStudy, startDate, endDate, gpa, achievements
  - skills: Object with technical, soft, and languages arrays
  - projects: Array of projects with name, description, technologies, url, startDate, endDate
  - certifications: (Optional) Array of certifications with name, issuer, dateEarned, expirationDate, credentialId, credentialUrl
  
  Example output format:
  {
    "personalInfo": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "summary": "Experienced software engineer...",
      "linkedin": "https://linkedin.com/in/johndoe",
      "portfolio": "https://johndoe.com"
    },
    "workExperience": [{
      "jobTitle": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2020-01",
      "endDate": "Present",
      "responsibilities": ["Developed features...", "Maintained codebase..."],
      "achievements": ["Improved performance by 50%"],
      "skillsUsed": ["JavaScript", "React", "Node.js"]
    }],
    "education": [{
      "institution": "Stanford University",
      "degree": "B.S. Computer Science",
      "fieldOfStudy": "Artificial Intelligence",
      "startDate": "2016-09",
      "endDate": "2020-06",
      "gpa": "3.8/4.0"
    }],
    "skills": {
      "technical": ["JavaScript", "TypeScript", "React", "Node.js"],
      "soft": ["Teamwork", "Communication"],
      "languages": ["English (Fluent)", "Spanish (Intermediate)"]
    },
    "projects": [{
      "name": "Portfolio Website",
      "description": "A personal portfolio website built with React and Node.js",
      "technologies": ["React", "Node.js", "MongoDB"],
      "url": "https://johndoe.com"
    }]
  }
  
  Here's the resume text to parse:
  ${rawText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (in case the model adds markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || [null, text];
    const jsonString = jsonMatch[1] || text;
    
    const parsedData = JSON.parse(jsonString);
    return resumeSchema.parse(parsedData);
  } catch (error) {
    console.error('Error processing resume with AI:', error);
    throw new Error(`Failed to process resume with AI: ${error instanceof Error ? error.message : String(error)}`);
  }
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

  // Extract userId and fileId from path (format: uploads/{userId}/{fileId}.{ext})
  const pathParts = filePath.split('/');
  if (pathParts.length < 3) {
    console.error('Invalid file path format:', filePath);
    return null;
  }

  const userId = pathParts[1];
  const fileId = pathParts[2].split('.')[0];
  const docRef = db.collection('ingestedResumes').doc(fileId);

  try {
    // Update status to processing
    await docRef.set({
      status: 'processing',
      userId,
      originalPath: filePath,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Extract text from file
    const rawText = await extractTextFromFile(bucket, filePath);
    
    // Process with AI
    const resumeData = await structureResumeWithAI(rawText);

    // Save the structured data to Firestore
    await docRef.update({
      status: 'pending_review',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      resumeData,
      rawText,
    });

    console.log(`Successfully processed resume ${fileId} for user ${userId}`);
    return null;
  } catch (error) {
    console.error(`Error processing resume ${fileId}:`, error);
    
    // Save error details to Firestore
    await docRef.update({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return null;
  }
});

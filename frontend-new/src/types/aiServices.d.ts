declare module '@/api/aiServices' {
  export type GenerateTailoredResumeResponse = {
    resume_content?: string;
    content?: string;
    [key: string]: any;
  };

  export const generateTailoredResume: (
    jobDescription: string,
    userId?: string
  ) => Promise<GenerateTailoredResumeResponse>;

  export const generateCoverLetter: (
    jobDescription: string,
    tone?: string
  ) => Promise<string>;

  const aiServices: {
    generateTailoredResume: typeof generateTailoredResume;
    generateCoverLetter: typeof generateCoverLetter;
  };

  export default aiServices;
}

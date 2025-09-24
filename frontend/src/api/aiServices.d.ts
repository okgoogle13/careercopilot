declare module '@/api/aiServices' {
  const generateCoverLetter: (jobDescription: string, tone?: string) => Promise<string>;
  const generateTailoredResume: (
    jobDescription: string,
    userId?: string
  ) => Promise<{
    resume_content?: string;
    content?: string;
    [key: string]: any;
  }>;

  export { generateCoverLetter, generateTailoredResume };

  const aiServices: {
    generateCoverLetter: typeof generateCoverLetter;
    generateTailoredResume: typeof generateTailoredResume;
  };

  export default aiServices;
}

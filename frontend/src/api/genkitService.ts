import { axiosInstance } from './axiosConfig';
import { CareerDatabase, JobOpportunity, StructuredAchievement } from '../types/career';

export const genkitService = {
  async generateCoverLetter(careerData: CareerDatabase, job: JobOpportunity, instructions: string) {
    try {
      const response = await axiosInstance.post('/genkit/cover-letter/generate', {
        candidate_profile: careerData.Personal_Information,
        job_description: `${job.Job_Title} at ${job.Company_Name}`,
        company_info: { name: job.Company_Name },
        special_instructions: instructions,
        style: 'professional',
        format_type: 'full_letter',
      });
      return {
        Cover_Letter_Draft: response.data.content,
        Cover_Letter_Audit: null,
      };
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      throw error;
    }
  },

  async generateKSCResponses(
    careerData: CareerDatabase,
    job: JobOpportunity,
    instructions: string
  ) {
    try {
      const response = await axiosInstance.post('/genkit/ksc/generate', {
        career_profile: careerData.Career_Profile,
        job_description: `${job.Job_Title} at ${job.Company_Name}`,
        job_requirements: job.Key_Responsibilities,
        special_instructions: instructions,
      });

      return {
        KSC_Responses_Drafts: response.data.responses || [],
      };
    } catch (error) {
      console.error('Failed to generate KSC responses:', error);
      throw error;
    }
  },

  async refineAchievementField(achievement: StructuredAchievement, field: string) {
    try {
      const response = await axiosInstance.post('/genkit/resume/optimize', {
        achievement,
        field_to_optimize: field,
      });
      return response.data.refined_text;
    } catch (error) {
      console.error('Failed to refine achievement:', error);
      throw error;
    }
  },
};

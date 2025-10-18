import { http, HttpResponse } from 'msw';

const API_BASE_URL = '/api'; // Assuming a proxy is set up for API calls

export const handlers = [
  // Mock for KSC Generation
  http.post(`${API_BASE_URL}/generate-ksc`, async ({ request }) => {
    const body = await request.json();
    if (!body.jobDescription || !body.resumeText || !body.criteria.length) {
      return new HttpResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return HttpResponse.json({
      kscResponses: body.criteria.map((c, index) => ({
        criterion: c.text,
        response: `This is a mock AI-generated response for criterion ${index + 1}. It demonstrates strong skills in alignment with the job description and resume provided.`,
      })),
    });
  }),

  // Mock for User Settings
  http.get(`${API_BASE_URL}/user/settings`, () => {
    return HttpResponse.json({
      userId: 'user-123',
      email: 'test@example.com',
      theme: 'dark',
      notifications: {
        newOpportunities: true,
        analysisComplete: true,
      },
    });
  }),

  // Mock for Opportunities
  http.get(`${API_BASE_URL}/opportunities`, () => {
    return HttpResponse.json([
      { id: 'opp-1', title: 'Senior Frontend Developer', company: 'TechCorp', status: 'Applied' },
      { id: 'opp-2', title: 'Lead Test Automation Engineer', company: 'Innovate LLC', status: 'Interviewing' },
    ]);
  }),

  // Mock for Documents
  http.get(`${API_BASE_URL}/documents`, () => {
    return HttpResponse.json([
        { id: 'doc-1', name: 'Master_Resume_v3.pdf', type: 'resume', uploadedAt: new Date().toISOString() },
        { id: 'doc-2', name: 'Cover_Letter_TechCorp.docx', type: 'cover_letter', uploadedAt: new Date().toISOString() },
    ]);
  }),
];

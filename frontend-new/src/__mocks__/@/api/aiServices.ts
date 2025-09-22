export const generateTailoredResume = jest.fn().mockResolvedValue({
  resume_content: '',
  content: ''
});

export const generateCoverLetter = jest.fn().mockResolvedValue('');

const aiServices = {
  generateTailoredResume,
  generateCoverLetter
};

export default aiServices;

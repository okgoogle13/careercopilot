import type {
  JobMatchingResult,
  ContentOptimizationResult,
  ResumeIntelligenceResult,
  SmartCoverLetterResult,
} from '../services/aiServices';

// Mock Job Matching Data
export const mockJobMatchingResult: JobMatchingResult = {
  matches: [
    {
      job_id: 'job-001',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA',
      match_score: 92,
      match_reasons: [
        'Strong React and TypeScript experience',
        'Leadership experience matches requirements',
        'Previous fintech experience is valuable',
      ],
      salary_range: { min: 140000, max: 180000 },
      required_skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
      missing_skills: ['GraphQL', 'Next.js'],
      job_description:
        'We are seeking a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our customer-facing applications using React and TypeScript. The ideal candidate has 5+ years of experience and strong leadership skills.',
    },
    {
      job_id: 'job-002',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      match_score: 87,
      match_reasons: [
        'Full-stack experience with React and Node.js',
        'Startup experience shows adaptability',
        'Strong problem-solving skills',
      ],
      salary_range: { min: 120000, max: 160000 },
      required_skills: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
      missing_skills: ['Docker', 'Kubernetes'],
      job_description:
        'Join our dynamic startup as a Full Stack Engineer. Work across the entire technology stack to build innovative products that solve real-world problems.',
    },
    {
      job_id: 'job-003',
      title: 'Tech Lead - Frontend',
      company: 'BigTech Corp',
      location: 'Seattle, WA',
      match_score: 78,
      match_reasons: [
        'Technical leadership experience',
        'Frontend expertise matches role',
        'Large-scale application experience',
      ],
      salary_range: { min: 180000, max: 220000 },
      required_skills: ['React', 'Vue.js', 'Team Leadership', 'System Architecture', 'Mentoring'],
      missing_skills: ['Vue.js', 'Micro-frontends'],
      job_description:
        'Lead our frontend engineering team to deliver exceptional user experiences. This role combines hands-on technical work with team leadership and strategic planning.',
    },
  ],
  analysis: {
    total_jobs_analyzed: 247,
    avg_match_score: 74.3,
    top_skills_in_demand: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
    skill_gaps: ['GraphQL', 'Vue.js', 'Micro-frontends', 'Kubernetes'],
    recommendations: [
      'Consider learning GraphQL to increase your competitiveness',
      'Vue.js skills would open up additional opportunities',
      'Docker and Kubernetes are increasingly important for senior roles',
      'Your React expertise is highly valued in the current market',
    ],
  },
};

// Mock Content Optimization Data
export const mockContentOptimizationResult: ContentOptimizationResult = {
  optimized_content: `John Doe
Senior Software Engineer | Full-Stack Developer

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Led cross-functional teams to deliver high-impact products, increasing user engagement by 40% and reducing load times by 60%.

TECHNICAL SKILLS
Frontend: React, TypeScript, JavaScript, Next.js, HTML5, CSS3, Redux
Backend: Node.js, Express.js, Python, RESTful APIs, GraphQL
Database: PostgreSQL, MongoDB, Redis
Cloud/DevOps: AWS (EC2, S3, Lambda), Docker, CI/CD pipelines
Tools: Git, Jest, Webpack, Jira, Figma

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc | 2020 - Present
• Architected and developed customer-facing React applications serving 100K+ daily active users
• Reduced application load time by 60% through code optimization and implementation of lazy loading
• Led team of 4 developers, mentoring junior engineers and conducting code reviews
• Implemented automated testing suite, improving code coverage from 45% to 85%
• Collaborated with product managers and designers to define technical requirements

Software Engineer | StartupXYZ | 2018 - 2020
• Built and maintained full-stack applications using React, Node.js, and PostgreSQL
• Increased user engagement by 40% through implementation of real-time features
• Developed RESTful APIs handling 1M+ requests per day
• Participated in agile development process and sprint planning

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2018

CERTIFICATIONS
• AWS Certified Developer - Associate (2021)
• React Developer Certification (2020)`,
  improvements: [
    {
      type: 'Impact Quantification',
      original: 'Improved application performance',
      improved: 'Reduced application load time by 60% through code optimization',
      reason: 'Quantified achievements are more compelling and demonstrate measurable impact',
      impact_score: 9,
    },
    {
      type: 'Keyword Enhancement',
      original: 'Worked with team members',
      improved: 'Led team of 4 developers, mentoring junior engineers',
      reason: 'Added leadership keywords and specific team size for better ATS matching',
      impact_score: 8,
    },
    {
      type: 'Technical Skills Formatting',
      original: 'Skills: React, Node.js, JavaScript',
      improved:
        'Frontend: React, TypeScript, JavaScript, Next.js\nBackend: Node.js, Express.js, Python',
      reason: 'Organized skills by category for better readability and ATS parsing',
      impact_score: 7,
    },
    {
      type: 'Professional Summary',
      original: 'Software engineer with experience',
      improved:
        'Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications',
      reason: 'Added specific experience level and key competencies in opening statement',
      impact_score: 8,
    },
  ],
  metrics: {
    readability_score: 89,
    ats_score: 94,
    keyword_density: {
      react: 0.05,
      'node.js': 0.03,
      javascript: 0.03,
      typescript: 0.02,
      aws: 0.02,
      python: 0.02,
      postgresql: 0.02,
      led: 0.02,
      developed: 0.04,
      implemented: 0.03,
    },
    impact_score: 92,
  },
  suggestions: [
    'Consider adding more industry-specific certifications',
    'Include links to portfolio or GitHub profile',
    'Add volunteer work or open source contributions if applicable',
    'Consider mentioning specific frameworks or libraries relevant to target roles',
  ],
};

// Mock Resume Intelligence Data
export const mockResumeIntelligenceResult: ResumeIntelligenceResult = {
  career_progression: {
    current_level: 'Senior Software Engineer',
    suggested_next_roles: [
      'Staff Software Engineer',
      'Engineering Team Lead',
      'Principal Engineer',
      'Engineering Manager',
    ],
    timeline_projection:
      '12-18 months with focused leadership development and system design expertise',
    required_skills_for_growth: [
      'System Architecture & Design',
      'Team Leadership & Mentoring',
      'Technical Strategy',
      'Cross-functional Collaboration',
      'Performance Management',
    ],
  },
  skills_analysis: {
    technical_skills: [
      {
        skill: 'React',
        proficiency_level: 'Expert',
        market_demand: 'High',
        improvement_suggestions: [
          'Stay updated with React 18+ features and concurrent rendering',
          'Learn advanced patterns like compound components and render props',
          'Contribute to React ecosystem through open source',
        ],
      },
      {
        skill: 'TypeScript',
        proficiency_level: 'Advanced',
        market_demand: 'High',
        improvement_suggestions: [
          'Master advanced type manipulation and generic constraints',
          'Learn TypeScript compiler internals',
          'Practice with complex type-level programming',
        ],
      },
      {
        skill: 'System Design',
        proficiency_level: 'Intermediate',
        market_demand: 'High',
        improvement_suggestions: [
          'Study distributed systems patterns',
          'Practice system design interviews',
          'Learn about microservices architecture',
        ],
      },
      {
        skill: 'Node.js',
        proficiency_level: 'Advanced',
        market_demand: 'High',
        improvement_suggestions: [
          'Explore Node.js internals and event loop optimization',
          'Learn advanced debugging and profiling techniques',
          'Study serverless architectures with Node.js',
        ],
      },
    ],
    soft_skills: [
      {
        skill: 'Leadership',
        evidence_strength: 'Strong',
        improvement_suggestions: [
          'Seek opportunities to lead larger teams',
          'Develop skills in strategic planning and roadmap creation',
          'Practice public speaking and technical presentations',
        ],
      },
      {
        skill: 'Communication',
        evidence_strength: 'Strong',
        improvement_suggestions: [
          'Write technical blog posts or documentation',
          'Mentor more junior developers',
          'Present at conferences or meetups',
        ],
      },
      {
        skill: 'Problem Solving',
        evidence_strength: 'Strong',
        improvement_suggestions: [
          'Tackle more complex architectural challenges',
          'Lead incident response and post-mortems',
          'Develop expertise in performance optimization',
        ],
      },
    ],
    skill_gaps: [
      {
        skill: 'Machine Learning',
        importance: 'Medium',
        learning_resources: [
          'Coursera Machine Learning Course by Andrew Ng',
          'Fast.ai Practical Deep Learning course',
          'Hands-on Machine Learning by Aurélien Géron',
        ],
      },
      {
        skill: 'DevOps/Infrastructure',
        importance: 'High',
        learning_resources: [
          'Docker Deep Dive course',
          'Kubernetes certification program',
          'AWS Solutions Architect certification',
        ],
      },
      {
        skill: 'Data Engineering',
        importance: 'Medium',
        learning_resources: [
          'Designing Data-Intensive Applications book',
          'Apache Kafka and streaming platforms',
          'Snowflake or BigQuery training',
        ],
      },
    ],
  },
  experience_insights: {
    achievements_impact: [
      'Led team of 4 developers - demonstrates leadership capability',
      'Reduced load times by 60% - shows performance optimization skills',
      'Increased user engagement by 40% - indicates product impact focus',
      'Improved test coverage from 45% to 85% - demonstrates quality focus',
    ],
    quantification_opportunities: [
      'Add specific metrics for API performance improvements',
      'Quantify the business impact of features you built',
      'Include specific technologies and scale of systems worked on',
      'Mention budget or timeline responsibilities',
    ],
    experience_narrative:
      'Strong individual contributor with growing leadership experience. Shows progression from junior to senior role with increasing responsibilities. Technical depth combined with business impact awareness makes you well-positioned for staff-level roles.',
    missing_experience_areas: [
      'Cross-functional product strategy experience',
      'Large-scale distributed systems design',
      'Budget and resource planning',
      'External stakeholder management',
    ],
  },
  market_positioning: {
    unique_value_proposition:
      'Full-stack engineer with strong React expertise and proven leadership abilities, combining technical depth with business impact focus',
    competitive_advantages: [
      'Rare combination of frontend specialization and full-stack capabilities',
      'Demonstrated ability to lead teams while maintaining technical excellence',
      'Track record of performance optimization and scalability improvements',
      'Strong foundation in modern development practices and testing',
    ],
    market_fit_score: 87,
    positioning_recommendations: [
      'Emphasize your leadership experience in technical contexts',
      'Highlight your performance optimization expertise as a differentiator',
      'Position yourself as a bridge between technical and product teams',
      'Showcase your mentoring and team development capabilities',
    ],
  },
};

// Mock Cover Letter Data
export const mockCoverLetterResult: SmartCoverLetterResult = {
  cover_letter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at Google. With over 6 years of experience building scalable web applications and a passion for Google's mission to organize the world's information, I am excited about the opportunity to contribute to your team's innovative projects.

In my current role as Senior Software Engineer at TechCorp Inc, I have led the development of customer-facing React applications serving over 100,000 daily active users. This experience aligns perfectly with Google's focus on creating products that impact millions of users worldwide. I successfully reduced application load times by 60% through strategic code optimization and implementation of performance best practices - skills that would be valuable for Google's emphasis on fast, reliable user experiences.

What particularly excites me about Google is your commitment to technical excellence and innovation. Your recent launch of Bard and continued investment in AI technologies demonstrates the kind of forward-thinking environment where I thrive. My experience leading a team of 4 developers and implementing automated testing suites that improved code coverage from 45% to 85% has prepared me for the collaborative, quality-focused culture that Google is known for.

I am particularly drawn to Google's data-driven approach to product development. In my previous role at StartupXYZ, I increased user engagement by 40% through careful analysis of user behavior and implementation of data-informed features. This experience would allow me to contribute meaningfully to Google's product teams from day one.

I would welcome the opportunity to discuss how my technical expertise in React, TypeScript, and cloud technologies, combined with my leadership experience and passion for user-centric development, can contribute to Google's continued success. Thank you for considering my application.

Sincerely,
John Doe`,
  company_research: {
    company_info:
      "Google is a multinational technology company that specializes in Internet-related services and products. Founded in 1998, Google has grown to become one of the world's most valuable companies, known for its search engine, advertising technologies, cloud computing, and consumer electronics. The company is renowned for its innovative culture, data-driven decision making, and commitment to technical excellence.",
    recent_news: [
      'Google launches Bard AI chatbot to compete with ChatGPT',
      'Alphabet reports strong Q4 2023 results driven by cloud growth',
      'Google announces new sustainability initiatives for 2024',
      'Google Cloud expands partnership with major enterprise clients',
    ],
    company_culture:
      'Google maintains a culture of innovation, collaboration, and technical excellence. The company values data-driven decision making, encourages experimentation, and promotes a "fail fast, learn fast" mentality. Google is known for its inclusive environment, emphasis on work-life balance, and commitment to making information universally accessible.',
    values_alignment: [
      'Focus on the user and all else will follow',
      'Technical excellence and innovation',
      'Data-driven decision making',
      'Collaboration and teamwork',
      'Continuous learning and growth',
    ],
  },
  personalization: {
    role_specific_highlights: [
      '6+ years of software development experience with focus on scalable applications',
      'Proven leadership experience managing development teams',
      'Strong background in React, TypeScript, and modern frontend technologies',
      'Track record of performance optimization and user experience improvements',
    ],
    company_specific_connections: [
      "Alignment with Google's mission to organize world's information",
      'Experience with large-scale applications serving 100K+ users',
      "Data-driven approach to product development matches Google's culture",
      'Passion for technical innovation and cutting-edge technologies',
    ],
    value_proposition:
      "Experienced full-stack engineer with proven leadership abilities and a track record of building high-performance applications that serve large user bases, directly applicable to Google's scale and quality requirements",
  },
  optimization_notes: [
    'Emphasized quantified achievements (60% load time improvement, 100K+ users)',
    "Connected experience directly to Google's scale and user focus",
    'Mentioned recent Google news (Bard launch) to show company awareness',
    "Highlighted data-driven approach to align with Google's culture",
    'Structured letter to flow from technical skills to leadership to company fit',
  ],
};

// Mock user documents
export const mockDocuments = [
  {
    id: 'doc-001',
    originalFilename: 'John_Doe_Resume_2024.pdf',
    type: 'resume',
    uploadDate: '2024-01-15',
    size: 245760,
    status: 'processed',
  },
  {
    id: 'doc-002',
    originalFilename: 'Cover_Letter_TechCorp.docx',
    type: 'cover_letter',
    uploadDate: '2024-01-20',
    size: 98304,
    status: 'processed',
  },
];

// Mock loading states for testing
export const createLoadingState = (isLoading = true) => ({
  isLoading,
  error: null,
  data: null,
});

export const createErrorState = (message: string) => ({
  isLoading: false,
  error: message,
  data: null,
});

export const createSuccessState = <T>(data: T) => ({
  isLoading: false,
  error: null,
  data,
});

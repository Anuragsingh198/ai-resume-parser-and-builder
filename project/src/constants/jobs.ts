import { Job } from '../types';

/**
 * Dummy job data for engineering positions
 * In production, this would be fetched from an API
 */
export const DUMMY_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    salary: '$150,000 - $200,000',
    postedDate: '2 days ago',
    description:
      'We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and developing scalable software solutions.',
    requirements: [
      '5+ years of experience',
      "Bachelor's degree in Computer Science",
      'Strong problem-solving skills',
    ],
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS'],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$120,000 - $180,000',
    postedDate: '5 days ago',
    description:
      'Join our team as a Full Stack Developer to build innovative web applications. You will work on both frontend and backend systems.',
    requirements: [
      '3+ years of experience',
      'Experience with modern frameworks',
      'Strong communication skills',
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'Amazon',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$130,000 - $190,000',
    postedDate: '1 week ago',
    description:
      'We are seeking a DevOps Engineer to help build and maintain our cloud infrastructure. You will work on CI/CD pipelines and automation.',
    requirements: [
      '4+ years of DevOps experience',
      'AWS certification preferred',
      'Experience with Kubernetes',
    ],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
  },
  {
    id: '4',
    title: 'Machine Learning Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'Full-time',
    salary: '$140,000 - $210,000',
    postedDate: '3 days ago',
    description:
      'Looking for a Machine Learning Engineer to develop and deploy ML models. You will work on cutting-edge AI technologies.',
    requirements: [
      "Master's degree in related field",
      '3+ years ML experience',
      'Strong mathematical background',
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Data Science'],
  },
  {
    id: '5',
    title: 'Frontend Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    salary: '$110,000 - $170,000',
    postedDate: '4 days ago',
    description:
      'Join our frontend team to build beautiful and responsive user interfaces. You will work on improving user experience.',
    requirements: [
      '2+ years of frontend experience',
      'Strong design sense',
      'Experience with React',
    ],
    skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Jest'],
  },
  {
    id: '6',
    title: 'Backend Engineer',
    company: 'Uber',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$125,000 - $185,000',
    postedDate: '6 days ago',
    description:
      'We need a Backend Engineer to build scalable APIs and services. You will work on high-traffic systems.',
    requirements: [
      '3+ years of backend experience',
      'Experience with microservices',
      'Strong system design skills',
    ],
    skills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'gRPC'],
  },
];


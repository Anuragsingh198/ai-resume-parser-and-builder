import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { JobMatchData } from '../types';

const JobMatch = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // Dummy job data - in a real app, this would be fetched based on jobId
  const jobData: Record<string, JobMatchData> = {
    '1': {
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Full-time',
      salary: '$150,000 - $200,000',
      postedDate: '2 days ago',
      jobDescription: `We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and developing scalable software solutions.

Responsibilities:
- Design and develop high-quality, scalable software solutions
- Collaborate with cross-functional teams to define and implement new features
- Write clean, maintainable, and efficient code
- Participate in code reviews and provide constructive feedback
- Troubleshoot and debug applications
- Stay up-to-date with emerging technologies and best practices

Requirements:
- 5+ years of experience in software development
- Bachelor's degree in Computer Science or related field
- Strong problem-solving and analytical skills
- Experience with Python, JavaScript, React, and Node.js
- Familiarity with cloud platforms (AWS, GCP)
- Excellent communication and teamwork skills`,
      parameters: {
        experience: '5+ years',
        education: "Bachelor's degree in Computer Science",
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
        location: 'Mountain View, CA',
        type: 'Full-time'
      },
      matchingScore: 72,
      matchedItems: [
        'Python experience',
        'JavaScript proficiency',
        'React knowledge',
        'Problem-solving skills',
        'Bachelor\'s degree'
      ],
      missingItems: [
        'AWS cloud platform experience',
        'Docker containerization',
        'Kubernetes orchestration',
        '5+ years of professional experience',
        'Microservices architecture knowledge'
      ]
    },
    '2': {
      title: 'Full Stack Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$120,000 - $180,000',
      postedDate: '5 days ago',
      jobDescription: `Join our team as a Full Stack Developer to build innovative web applications. You will work on both frontend and backend systems.

Responsibilities:
- Develop and maintain web applications using modern frameworks
- Build RESTful APIs and integrate with databases
- Implement responsive user interfaces
- Write unit and integration tests
- Collaborate with designers and product managers
- Optimize application performance

Requirements:
- 3+ years of full-stack development experience
- Proficiency in TypeScript, React, and Node.js
- Experience with PostgreSQL and database design
- Knowledge of Docker and containerization
- Strong understanding of web technologies
- Excellent problem-solving abilities`,
      parameters: {
        experience: '3+ years',
        education: "Bachelor's degree in Computer Science",
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL'],
        location: 'Seattle, WA',
        type: 'Full-time'
      },
      matchingScore: 68,
      matchedItems: [
        'TypeScript knowledge',
        'React experience',
        'Node.js proficiency',
        'Web development skills',
        'Problem-solving abilities'
      ],
      missingItems: [
        'PostgreSQL database experience',
        'Docker containerization',
        'GraphQL API knowledge',
        '3+ years professional experience',
        'Integration testing experience'
      ]
    },
    '3': {
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$130,000 - $190,000',
      postedDate: '1 week ago',
      jobDescription: `We are seeking a DevOps Engineer to help build and maintain our cloud infrastructure. You will work on CI/CD pipelines and automation.

Responsibilities:
- Design and implement CI/CD pipelines
- Manage cloud infrastructure on AWS
- Automate deployment processes
- Monitor system performance and reliability
- Troubleshoot infrastructure issues
- Implement security best practices

Requirements:
- 4+ years of DevOps experience
- AWS certification preferred
- Experience with Kubernetes and containerization
- Proficiency in Terraform and infrastructure as code
- Knowledge of Jenkins and CI/CD tools
- Strong Linux administration skills`,
      parameters: {
        experience: '4+ years',
        education: "Bachelor's degree or equivalent experience",
        skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Docker'],
        location: 'Austin, TX',
        type: 'Full-time'
      },
      matchingScore: 45,
      matchedItems: [
        'Basic cloud knowledge',
        'Linux familiarity',
        'Problem-solving skills'
      ],
      missingItems: [
        'AWS certification and experience',
        'Kubernetes orchestration',
        'Terraform infrastructure as code',
        'Jenkins CI/CD experience',
        '4+ years DevOps experience',
        'Containerization expertise'
      ]
    },
    '4': {
      title: 'Machine Learning Engineer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      salary: '$140,000 - $210,000',
      postedDate: '3 days ago',
      jobDescription: `Looking for a Machine Learning Engineer to develop and deploy ML models. You will work on cutting-edge AI technologies.

Responsibilities:
- Design and implement machine learning models
- Preprocess and analyze large datasets
- Deploy ML models to production environments
- Collaborate with data scientists and engineers
- Optimize model performance and accuracy
- Stay current with ML research and techniques

Requirements:
- Master's degree in Computer Science, Statistics, or related field
- 3+ years of experience in machine learning
- Strong mathematical and statistical background
- Proficiency in Python, TensorFlow, and PyTorch
- Experience with MLOps and model deployment
- Knowledge of deep learning architectures`,
      parameters: {
        experience: '3+ years',
        education: "Master's degree in Computer Science or related field",
        skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Data Science', 'Deep Learning'],
        location: 'Menlo Park, CA',
        type: 'Full-time'
      },
      matchingScore: 55,
      matchedItems: [
        'Python programming',
        'Basic machine learning knowledge',
        'Problem-solving skills',
        'Mathematical background'
      ],
      missingItems: [
        'TensorFlow framework experience',
        'PyTorch deep learning framework',
        'MLOps deployment experience',
        'Master\'s degree in related field',
        '3+ years ML professional experience',
        'Deep learning architecture knowledge'
      ]
    },
    '5': {
      title: 'Frontend Engineer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      type: 'Full-time',
      salary: '$110,000 - $170,000',
      postedDate: '4 days ago',
      jobDescription: `Join our frontend team to build beautiful and responsive user interfaces. You will work on improving user experience.

Responsibilities:
- Develop responsive and accessible user interfaces
- Implement pixel-perfect designs
- Optimize frontend performance
- Write clean, maintainable React code
- Collaborate with UX designers
- Write comprehensive unit tests

Requirements:
- 2+ years of frontend development experience
- Strong design sense and attention to detail
- Proficiency in React and TypeScript
- Experience with CSS and styling frameworks
- Knowledge of GraphQL and API integration
- Experience with testing frameworks like Jest`,
      parameters: {
        experience: '2+ years',
        education: "Bachelor's degree or equivalent experience",
        skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Jest', 'HTML'],
        location: 'Los Gatos, CA',
        type: 'Full-time'
      },
      matchingScore: 75,
      matchedItems: [
        'React framework experience',
        'TypeScript knowledge',
        'CSS styling skills',
        'Frontend development experience',
        'Design sense',
        'HTML proficiency'
      ],
      missingItems: [
        'GraphQL API integration',
        'Jest testing framework',
        '2+ years professional experience',
        'Performance optimization expertise'
      ]
    },
    '6': {
      title: 'Backend Engineer',
      company: 'Uber',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$125,000 - $185,000',
      postedDate: '6 days ago',
      jobDescription: `We need a Backend Engineer to build scalable APIs and services. You will work on high-traffic systems.

Responsibilities:
- Design and develop scalable backend systems
- Build RESTful and gRPC APIs
- Optimize database queries and performance
- Implement microservices architecture
- Ensure system reliability and scalability
- Collaborate with frontend and mobile teams

Requirements:
- 3+ years of backend development experience
- Experience with microservices architecture
- Proficiency in Go or Python
- Strong system design skills
- Experience with PostgreSQL and Redis
- Knowledge of distributed systems`,
      parameters: {
        experience: '3+ years',
        education: "Bachelor's degree in Computer Science",
        skills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'gRPC', 'Microservices'],
        location: 'San Francisco, CA',
        type: 'Full-time'
      },
      matchingScore: 65,
      matchedItems: [
        'Python programming',
        'Backend development experience',
        'System design knowledge',
        'Database understanding',
        'Problem-solving skills'
      ],
      missingItems: [
        'Go programming language',
        'PostgreSQL database experience',
        'Redis caching systems',
        'gRPC protocol knowledge',
        'Microservices architecture',
        '3+ years professional experience'
      ]
    }
  };

  // Get job data with fallback - in production, this would fetch from API
  const job = jobId && jobData[jobId] ? jobData[jobId] : jobData['1'];

  // Validate job data exists
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Get color classes based on matching score
   * @param score - Matching score (0-100)
   * @returns Tailwind CSS classes for score color
   */
  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  /**
   * Handle navigation to resume creation page with job details
   */
  const handleCreateResume = (): void => {
    navigate('/resume/create', { 
      state: { 
        jobTitle: job.title,
        companyName: job.company,
        jobDescription: job.jobDescription
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Jobs</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{job.title}</h1>
                  <p className="text-xl text-gray-600">{job.company}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg ${getScoreColor(job.matchingScore)}`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">{job.matchingScore}%</span>
                </div>
                <p className="text-xs mt-1">Match Score</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                {job.type}
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-2" />
                {job.salary}
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {job.postedDate}
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Job Description
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {job.jobDescription}
              </pre>
            </div>
          </div>

          {/* Parameters Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Experience Required</p>
                <p className="text-lg font-semibold text-blue-700">{job.parameters.experience}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Education</p>
                <p className="text-lg font-semibold text-blue-700">{job.parameters.education}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.parameters.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Matching Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Matched Items */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                What You Have
              </h3>
              <ul className="space-y-2">
                {job.matchedItems.map((item: string, index: number) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Items */}
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
                What's Missing in Your Resume
              </h3>
              <ul className="space-y-2">
                {job.missingItems.map((item: string, index: number) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="border-t pt-6">
            <button
              onClick={handleCreateResume}
              className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Create Resume According to This Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatch;


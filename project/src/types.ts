export interface User {
    name: string;
    email: string;
    role: string;
    experience: string;
    skills: string[];
    resumeCompletionStatus: number;
  }
  
 export  type AppAction =
| { type: 'SET_USER'; payload: User }
| { type: 'SET_RESUME_DATA'; payload: ResumeData }
| { type: 'SET_JOB_DETAILS'; payload: JobDetails }
| { type: 'ADD_GENERATED_RESUME'; payload: GeneratedResume }
| { type: 'SET_UPLOADED_FILE'; payload: File | null }
| { type: 'SET_PARSED_RESUME'; payload: ParsedResumeData | null }
| { type: 'RESET_RESUME_DATA' }
| { type: 'SET_LOADING'; payload: boolean }
| { type: 'SET_ERROR'; payload: string | null }
|{type:'LOGOUT'}

  export interface ResumeData {
    basicInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string;
      portfolio: string;
    };
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      gpa?: string;
    }>;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    projects: Array<{
      name: string;
      description: string;
      technologies: string;
      link?: string;
    }>;
    skills: string[];
    achievements: string[];
    additionalInfo: string;
  }
  
  export interface JobDetails {
    companyName: string;
    jobDescription: string;
    position: string;
    keywords: string;
    resumeStyle: 'ATS' | 'Modern' | 'Minimal' | 'Professional';
    useDemoContent: boolean;
  }
  
  export interface GeneratedResume {
    id: string;
    companyName: string;
    position: string;
    createdAt: string;
    resumeUrl?: string;
  }

  export interface ParsedResumeData {
    [key: string]: unknown;
  }
  
  export interface AppState {
    user: User | null;
    resumeData: ResumeData | null;
    jobDetails: JobDetails | null;
    generatedResumes: GeneratedResume[];
    uploadedResumeFile: File | null;
    parsedResumeData: ParsedResumeData | null;
    loading: boolean;
    error: string | null;
  }

  // Job-related types
  export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';

  export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: JobType;
    salary: string;
    postedDate: string;
    description: string;
    requirements: string[];
    skills: string[];
    companyLogo?: string;
  }

  export interface JobMatchData {
    title: string;
    company: string;
    location: string;
    type: JobType;
    salary: string;
    postedDate: string;
    jobDescription: string;
    parameters: {
      experience: string;
      education: string;
      skills: string[];
      location: string;
      type: JobType;
    };
    matchingScore: number;
    matchedItems: string[];
    missingItems: string[];
  }
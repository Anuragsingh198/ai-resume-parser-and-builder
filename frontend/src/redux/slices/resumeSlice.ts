import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResumeData, JobDetails, GeneratedResume, ParsedResumeData } from '../../types';

interface ResumeState {
  resumeData: ResumeData | null;
  jobDetails: JobDetails | null;
  generatedResumes: GeneratedResume[];
  uploadedResumeFile: File | null;
  parsedResumeData: ParsedResumeData | null;
}

const initialState: ResumeState = {
  resumeData: null,
  jobDetails: null,
  generatedResumes: [],
  uploadedResumeFile: null,
  parsedResumeData: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumeData: (state, action: PayloadAction<ResumeData>) => {
      state.resumeData = action.payload;
    },
    setJobDetails: (state, action: PayloadAction<JobDetails>) => {
      state.jobDetails = action.payload;
    },
    addGeneratedResume: (state, action: PayloadAction<GeneratedResume>) => {
      state.generatedResumes.push(action.payload);
    },
    setUploadedFile: (state, action: PayloadAction<File | null>) => {
      state.uploadedResumeFile = action.payload;
    },
    setParsedResume: (state, action: PayloadAction<ParsedResumeData | null>) => {
      state.parsedResumeData = action.payload;
    },
    resetResumeData: (state) => {
      state.resumeData = null;
      state.jobDetails = null;
      state.uploadedResumeFile = null;
      state.parsedResumeData = null;
    },
  },
});

export const {
  setResumeData,
  setJobDetails,
  addGeneratedResume,
  setUploadedFile,
  setParsedResume,
  resetResumeData,
} = resumeSlice.actions;

export default resumeSlice.reducer;

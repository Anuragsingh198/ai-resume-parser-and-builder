import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '../../types';
import { fetchJobs, updateJobAsync } from '../actions/jobAction';

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  selectedJob: Job | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  selectedJob: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    updateJob: (state: JobState, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    updateJobFields: (state: JobState, action: PayloadAction<{ id: string; updates: Partial<Job> }>) => {
      const index = state.jobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload.updates };
      }
    },
    addJob: (state: JobState, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    },
    removeJob: (state: JobState, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
    setSelectedJob: (state: JobState, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    clearJobs: (state: JobState) => {
      state.jobs = [];
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch jobs';
      });
    
    builder
      .addCase(updateJobAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update job';
      });
  },
});

export const { 
  updateJob, 
  updateJobFields, 
  addJob, 
  removeJob, 
  setSelectedJob, 
  clearJobs 
} = jobSlice.actions;

export default jobSlice.reducer;
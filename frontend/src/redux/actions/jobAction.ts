import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Job } from '../../types';

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 
           error.response?.data?.errors?.[0]?.message || 
           error.response?.data?.detail || 
           defaultMessage;
  }
  return defaultMessage;
};

export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/jobs`);
      return response.data.data || response.data;
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, 'Failed to fetch jobs');
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateJobAsync = createAsyncThunk(
  'job/updateJob',
  async (job: Job, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/jobs/${job.id}`, 
        job
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, 'Failed to update job');
      return rejectWithValue(errorMsg);
    }
  }
);

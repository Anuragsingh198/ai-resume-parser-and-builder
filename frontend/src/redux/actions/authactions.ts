import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserLoginData, UserRegisterData } from './types';

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 
           error.response?.data?.errors?.[0]?.message || 
           error.response?.data?.detail || 
           defaultMessage;
  }
  return defaultMessage;
};

export const userRegister = createAsyncThunk(
  'auth/register',
  async (userData: UserRegisterData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/register`, userData);
      const userData_response = response.data.data;
      localStorage.setItem('user', JSON.stringify(userData_response));
      return response.data;
    } catch (error: unknown) {
      console.error('Error registering user:', error);
      const errorMsg = getErrorMessage(error, 'Registration failed');
      return rejectWithValue(errorMsg);
    }
  }
);

export const userLogin = createAsyncThunk(
  'auth/login',
  async (userData: UserLoginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, userData);
      const loginData = response.data.data;
      localStorage.setItem('token', loginData.access_token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.access_token}`;
      return response.data;
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, 'Login failed');
      return rejectWithValue(errorMsg);
    }
  }
);

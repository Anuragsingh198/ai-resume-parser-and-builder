import { AppDispatch } from './store';
import { setUser, logout } from './slices/authSlice';
import axios from 'axios';

export const initializeStore = (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common['Authorization'] = '';
  }

  const user = localStorage.getItem('user');
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';
    }
  } else if (!token) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(logout());
  }
};

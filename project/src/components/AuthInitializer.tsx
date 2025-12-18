import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import axios from 'axios';

/**
 * Component to initialize axios headers based on Redux state
 * This ensures axios headers are updated when user state changes
 */
const AuthInitializer = () => {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      axios.defaults.headers.common['Authorization'] = '';
    }
  }, [user]);

  return null;
};

export default AuthInitializer;

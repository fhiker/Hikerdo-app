import axiosInstance from '@/api/api-client';
import { useCallback } from 'react';

const useSignout = () => {
  const signout = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/auth/signout');
      return response.data;
    } catch (error) {
      console.error('Signout failed:', error);
      throw error;
    }
  }, []);

  return { signout };
};

export default useSignout;

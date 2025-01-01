import axios from 'axios';
import { useLoading } from '../context/loadingContext';
import api from '@/lib/axios';
import { notification } from 'antd';

const usePost = <T>() => {
  const { setLoading } = useLoading();

  const handlePost = async (url: string, data: T) => {
    setLoading(true);
    try {
      const response = await api.post<T>(url, data);

      // Show success notification with automatic close after 3 seconds
      notification.success({
        message: 'Success',
        description: 'Operation completed successfully.',
        duration: 3, // Notification will close after 3 seconds
      });

      return { success: true, data: response.data }; // return success flag and data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'An unexpected error occurred';

        // Show error notification with automatic close after 3 seconds
        notification.error({
          message: 'Error',
          description: message,
          duration: 3, // Notification will close after 3 seconds
        });

        return { success: false, error: message }; // return error message in a structured format
      } else {
        const message = 'An unexpected error occurred';

        // Show error notification with automatic close after 3 seconds
        notification.error({
          message: 'Error',
          description: message,
          duration: 3, // Notification will close after 3 seconds
        });

        return { success: false, error: message }; // return a general error message
      }
    } finally {
      setLoading(false);
    }
  };

  return { handlePost };
};

export default usePost;

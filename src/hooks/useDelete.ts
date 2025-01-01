import { AxiosError } from 'axios';
import { useLoading } from '../context/loadingContext';
import api from '@/lib/axios';
import { notification } from 'antd';


const useDelete = () => {
  const { setLoading } = useLoading();
 

  const deleteById = async (url: string, id: string | number) => {
    setLoading(true);

    try {
      await api.delete(`${url}/?id=${id}`);
      notification.success({
        message: 'Success',
        description: 'Data deleted successfully!',
      });
      return true;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';

      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

    
      notification.error({
        message: 'Error',
        description: errorMessage,
        duration: 3,
      });

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteById };
};

export default useDelete;

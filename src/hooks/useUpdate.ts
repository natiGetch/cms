import { AxiosError } from 'axios';
import { useLoading } from '../context/loadingContext';
import api from '@/lib/axios';
import { notification } from 'antd';


const useUpdate = <T>() => {
  const { setLoading } = useLoading();

  const updateById = async (endPoint: string , id: string, data: T, action? : string ) => {
    setLoading(true);

    try {
      const url = action ? `${endPoint}?action=${action}&id=${id}` : `${endPoint}/?id=${id}`
      const response = await api.put<T>(url, data);
      notification.success({
        message: 'Success',
        description: 'Data updated successfully!',
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

  return { updateById };
};

export default useUpdate;

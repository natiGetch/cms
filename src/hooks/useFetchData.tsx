import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useLoading } from '../context/loadingContext';
import api from '@/lib/axios';
import { notification } from 'antd';
import { useError } from '@/context/errorContext';
import { useRouter } from 'next/router';

interface FetchDataParams {
  endpoint: string;
  page?: number;
  limit?: number;
  id?: any;
}

interface UseFetchData<T> {
  data: T | null | any;
}

const useFetchData = <T,>({ endpoint, page, limit, id }: FetchDataParams): UseFetchData<T> => {
  const [data, setData] = useState<T | null>(null);
  const { setLoading } = useLoading();
  const { setError } = useError();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const url = id 
          ? `${endpoint}?id=${id}` 
          : `${endpoint}?page=${page}${limit ? `&limit=${limit}` : ''}`;
        const response = await api.get<T>(url);
        setData(response.data);
        setError(false);
        notification.success({
          message: 'Success',
          description: 'Data fetched successfully!',
        });
      } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof AxiosError && error.response) {
          errorMessage = error.response.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(true);
        setData(null);
        notification.error({
          message: 'Error',
          description: errorMessage,
          duration: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, page, limit, id, router.isReady]);

  return { data };
};

export default useFetchData;

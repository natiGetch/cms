
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials : true
});



export default api;

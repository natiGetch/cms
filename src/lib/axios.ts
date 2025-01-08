import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  
});



export default api;

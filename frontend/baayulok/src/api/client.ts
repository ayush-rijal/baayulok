import axios, { type InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'https://localhost:7012',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('bl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message: string =
      (error.response?.data as { message?: string; title?: string })?.message ??
      (error.response?.data as { title?: string })?.title ??
      (error as Error).message ??
      'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export default client;
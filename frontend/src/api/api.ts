import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
});

export const setBasicAuth = (username:string, password:string) => {
  const token = btoa(`${username}:${password}`);
  api.defaults.headers.common['Authorization'] = `Basic ${token}`;
};



// filepath: lib/api/tasks.ts

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-management-3aw8-rhxcazdtj.vercel.app/', // Adjust if your backend is hosted elsewhere
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: add token if using protected routes later
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or use context/store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

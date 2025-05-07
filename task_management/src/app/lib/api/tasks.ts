// filepath: lib/api/tasks.ts
NEXT_PUBLIC_API_URL=https://task-management-backend-aye4.onrender.com

import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-management-backend-aye4.onrender.com', // Adjust if your backend is hosted elsewhere
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

// frontend/src/api.js
import axios from 'axios';

// Base URL comes from Vite env (Vercel provides VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

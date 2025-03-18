// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service
export const authService = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  }
};

// Group service
export const groupService = {
  createGroup: async (name, description) => {
    const response = await api.post('/groups', { name, description });
    return response.data;
  },
  
  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  
  getGroup: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },
  
  joinGroup: async (inviteCode) => {
    const response = await api.post('/groups/join', { inviteCode });
    return response.data;
  }
};

// Message service
export const messageService = {
  getMessages: async (groupId) => {
    const response = await api.get(`/groups/${groupId}/messages`);
    return response.data;
  },
  
  sendMessage: async (groupId, content) => {
    const response = await api.post(`/groups/${groupId}/messages`, { content });
    return response.data;
  }
};

export default api;
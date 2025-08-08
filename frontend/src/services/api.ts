import axios from 'axios';
import type { LoginCredentials, RegisterData } from '../types';

const API_URL = 'https://front-desk-system-of-clinic-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API calls
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Doctors API calls
export const doctorsApi = {
  getAll: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/doctors', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/doctors/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },
};

// Patients API calls
export const patientsApi = {
  getAll: async (search?: any) => {
    const response = await api.get('/patients', { params: search });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/patients', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/patients/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

// Appointments API calls
export const appointmentsApi = {
  getAll: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

// Queue API calls
export const queueApi = {
  getAll: async () => {
    const response = await api.get('/queue');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/queue/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/queue', data);
    return response.data;
  },
  updateStatus: async (id: string, status: 'waiting' | 'with_doctor' | 'completed' | 'canceled') => {
    const response = await api.patch(`/queue/${id}/status/${status}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/queue/${id}`);
    return response.data;
  },
};

export default api;
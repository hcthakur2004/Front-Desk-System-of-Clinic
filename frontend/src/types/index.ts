// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  role?: 'admin' | 'front_desk';
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'front_desk';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Doctor types
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
  location: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorData {
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
  location: string;
}

// Patient types
export interface Patient {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientData {
  name: string;
  phone?: string;
  email?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: string;
}

// Appointment types
export interface Appointment {
  id: string;
  appointmentDate: string;
  status: 'booked' | 'completed' | 'canceled';
  notes?: string;
  doctorId: string;
  patientId: string;
  doctor?: Doctor;
  patient?: Patient;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  appointmentDate: string;
  notes?: string;
  doctorId: string;
  patientId: string;
}

// Queue types
export interface Queue {
  id: string;
  queueNumber: number;
  status: 'waiting' | 'with_doctor' | 'completed' | 'canceled';
  priority: 'normal' | 'urgent';
  patientId: string;
  doctorId?: string;
  notes?: string;
  patient?: Patient;
  doctor?: Doctor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQueueData {
  patientId: string;
  doctorId?: string;
  priority?: 'normal' | 'urgent';
  notes?: string;
}
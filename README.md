# Hospital Management System

A comprehensive hospital management system built with NestJS (backend) and React (frontend). This system helps hospitals manage doctors, patients, appointments, and patient queues efficiently.

## Features

- **User Authentication**: Secure login and registration with JWT
- **Doctor Management**: Add, update, and manage doctor information
- **Patient Management**: Register and manage patient records
- **Appointment Scheduling**: Book and manage appointments between doctors and patients
- **Queue Management**: Manage patient queues with priority settings

## Backend (NestJS)

The backend is built with NestJS, TypeScript, and MySQL using TypeORM.

### Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a MySQL database named `hospital_db`

4. Start the development server:
   ```
   npm run start:dev
   ```

### API Endpoints

- **Auth**: `/auth/login`, `/auth/register`
- **Doctors**: `/doctors`
- **Patients**: `/patients`
- **Appointments**: `/appointments`
- **Queue**: `/queue`

## Frontend (React)

The frontend will be built with React, TypeScript, and Material-UI.

### Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Database Schema

- **Users**: Authentication and user management
- **Doctors**: Doctor information and availability
- **Patients**: Patient records and contact information
- **Appointments**: Scheduled appointments between doctors and patients
- **Queue**: Patient queue management with priority settings

## License

MIT
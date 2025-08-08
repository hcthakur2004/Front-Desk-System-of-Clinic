import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DoctorsPage from './pages/doctors/DoctorsPage';
import PatientsPage from './pages/patients/PatientsPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import QueuePage from './pages/queue/QueuePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="doctors"
                element={
                  <ProtectedRoute>
                    <DoctorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="patients"
                element={
                  <ProtectedRoute>
                    <PatientsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="queue"
                element={
                  <ProtectedRoute>
                    <QueuePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

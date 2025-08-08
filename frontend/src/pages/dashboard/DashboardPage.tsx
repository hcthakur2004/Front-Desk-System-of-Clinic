import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  LocalHospital as DoctorIcon,
  Person as PatientIcon,
  EventNote as AppointmentIcon,
  QueuePlayNext as QueueIcon,
} from '@mui/icons-material';
import { doctorsApi, patientsApi, appointmentsApi, queueApi } from '../../services/api';
import type { Appointment, Queue } from '../../types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    queueEntries: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [currentQueue, setCurrentQueue] = useState<Queue[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch counts
        const [doctors, patients, appointments, queue] = await Promise.all([
          doctorsApi.getAll(),
          patientsApi.getAll(),
          appointmentsApi.getAll(),
          queueApi.getAll(),
        ]);

        setStats({
          doctors: doctors.length,
          patients: patients.length,
          appointments: appointments.length,
          queueEntries: queue.filter((q: any) => q.status === 'waiting').length,
        });

        // Filter today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointments.filter((appt: any) => {
          return appt.appointmentDate.startsWith(today);
        });
        setTodayAppointments(todayAppts);

        // Get current queue (waiting and with_doctor)
        const currentQ = queue.filter(
          (q: any) => q.status === 'waiting' || q.status === 'with_doctor'
        );
        setCurrentQueue(currentQ);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doctors"
            value={stats.doctors}
            icon={<DoctorIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Patients"
            value={stats.patients}
            icon={<PatientIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appointments"
            value={stats.appointments}
            icon={<AppointmentIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Queue"
            value={stats.queueEntries}
            icon={<QueueIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Today's Appointments and Current Queue */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {todayAppointments.length > 0 ? (
              <List>
                {todayAppointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {appointment.patient?.name} - {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Doctor: {appointment.doctor?.name}
                            </Typography>
                            {appointment.notes && (
                              <Typography variant="body2" color="text.secondary">
                                Notes: {appointment.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No appointments scheduled for today
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Current Queue
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {currentQueue.length > 0 ? (
              <List>
                {currentQueue.map((queueEntry) => (
                  <React.Fragment key={queueEntry.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            #{queueEntry.queueNumber} - {queueEntry.patient?.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Status: {queueEntry.status === 'waiting' ? 'Waiting' : 'With Doctor'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Doctor: {queueEntry.doctor?.name || 'Not assigned'}
                            </Typography>
                            {queueEntry.priority === 'urgent' && (
                              <Typography variant="body2" color="error">
                                Priority: Urgent
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No patients in queue
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
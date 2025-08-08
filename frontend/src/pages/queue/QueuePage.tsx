import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalHospital as DoctorIcon,
} from '@mui/icons-material';
import { queueApi, doctorsApi, patientsApi } from '../../services/api';
import type { Queue, Doctor, Patient, CreateQueueData } from '../../types';

const QueuePage: React.FC = () => {
  const [queue, setQueue] = useState<Queue[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<CreateQueueData>({
    patientId: '',
    doctorId: '',
    priority: 'normal',
    notes: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [queueData, doctorsData, patientsData] = await Promise.all([
        queueApi.getAll(),
        doctorsApi.getAll(),
        patientsApi.getAll(),
      ]);
      setQueue(queueData);
      setDoctors(doctorsData);
      setPatients(patientsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      priority: 'normal',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await queueApi.create(formData);
      setSnackbar({
        open: true,
        message: 'Patient added to queue successfully',
        severity: 'success',
      });
      handleCloseDialog();
      fetchData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'An error occurred',
        severity: 'error',
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: 'waiting' | 'with_doctor' | 'completed' | 'canceled') => {
    try {
      await queueApi.updateStatus(id, status);
      setSnackbar({
        open: true,
        message: `Queue status updated to ${status.replace('_', ' ')}`,
        severity: 'success',
      });
      fetchData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update status',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this patient from the queue?')) {
      try {
        await queueApi.delete(id);
        setSnackbar({
          open: true,
          message: 'Patient removed from queue successfully',
          severity: 'success',
        });
        fetchData();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || 'Failed to remove patient from queue',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'primary';
      case 'with_doctor':
        return 'warning';
      case 'completed':
        return 'success';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Filter queue by status
  const waitingQueue = queue.filter((q) => q.status === 'waiting');
  const withDoctorQueue = queue.filter((q) => q.status === 'with_doctor');
  const completedQueue = queue.filter((q) => q.status === 'completed');

  if (loading && queue.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Patient Queue</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Add to Queue
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Queue Cards View */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Waiting Queue */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip label={waitingQueue.length} color="primary" size="small" sx={{ mr: 1 }} />
              Waiting
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {waitingQueue.length > 0 ? (
                waitingQueue.map((item) => (
                  <Card key={item.id} sx={{ mb: 2, border: item.priority === 'urgent' ? '2px solid #f44336' : 'none' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        #{item.queueNumber} - {item.patient?.name}
                      </Typography>
                      {item.priority === 'urgent' && (
                        <Chip label="Urgent" color="error" size="small" sx={{ mb: 1 }} />
                      )}
                      {item.doctor && (
                        <Typography variant="body2" color="text.secondary">
                          Doctor: {item.doctor.name}
                        </Typography>
                      )}
                      {item.notes && (
                        <Typography variant="body2" color="text.secondary">
                          Notes: {item.notes}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<DoctorIcon />}
                        onClick={() => handleUpdateStatus(item.id, 'with_doctor')}
                      >
                        With Doctor
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleUpdateStatus(item.id, 'canceled')}
                      >
                        Cancel
                      </Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                  No patients waiting
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* With Doctor Queue */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: '#fff8e1' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip label={withDoctorQueue.length} color="warning" size="small" sx={{ mr: 1 }} />
              With Doctor
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {withDoctorQueue.length > 0 ? (
                withDoctorQueue.map((item) => (
                  <Card key={item.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        #{item.queueNumber} - {item.patient?.name}
                      </Typography>
                      {item.doctor && (
                        <Typography variant="body2" color="text.secondary">
                          Doctor: {item.doctor.name}
                        </Typography>
                      )}
                      {item.notes && (
                        <Typography variant="body2" color="text.secondary">
                          Notes: {item.notes}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleUpdateStatus(item.id, 'completed')}
                      >
                        Complete
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleUpdateStatus(item.id, 'canceled')}
                      >
                        Cancel
                      </Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                  No patients with doctor
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Completed Queue */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', bgcolor: '#e8f5e9' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip label={completedQueue.length} color="success" size="small" sx={{ mr: 1 }} />
              Completed Today
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {completedQueue.length > 0 ? (
                completedQueue.map((item) => (
                  <Card key={item.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        #{item.queueNumber} - {item.patient?.name}
                      </Typography>
                      {item.doctor && (
                        <Typography variant="body2" color="text.secondary">
                          Doctor: {item.doctor.name}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                  No completed visits today
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Full Queue Table */}
      <Typography variant="h6" gutterBottom>
        All Queue Entries
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Queue #</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.length > 0 ? (
              queue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.queueNumber}</TableCell>
                  <TableCell>{item.patient?.name || 'Unknown'}</TableCell>
                  <TableCell>{item.doctor?.name || 'Not assigned'}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(item.status)}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      color={item.priority === 'urgent' ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                  <TableCell>
                    {item.status === 'waiting' && (
                      <IconButton
                        color="primary"
                        onClick={() => handleUpdateStatus(item.id, 'with_doctor')}
                        size="small"
                        title="Mark as with doctor"
                      >
                        <DoctorIcon />
                      </IconButton>
                    )}
                    {item.status === 'with_doctor' && (
                      <IconButton
                        color="success"
                        onClick={() => handleUpdateStatus(item.id, 'completed')}
                        size="small"
                        title="Mark as completed"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    {(item.status === 'waiting' || item.status === 'with_doctor') && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id)}
                        size="small"
                        title="Remove from queue"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No queue entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add to Queue Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Patient to Queue</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="patient-label">Patient</InputLabel>
              <Select
                labelId="patient-label"
                id="patientId"
                name="patientId"
                value={formData.patientId}
                label="Patient"
                onChange={handleInputChange}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="doctor-label">Doctor (Optional)</InputLabel>
              <Select
                labelId="doctor-label"
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                label="Doctor (Optional)"
                onChange={handleInputChange}
              >
                <MenuItem value="">Not assigned yet</MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                name="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleInputChange}
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              id="notes"
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add to Queue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QueuePage;
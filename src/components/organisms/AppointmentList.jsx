import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { appointmentService } from '@/services';

const AppointmentList = ({ selectedDate, onAppointmentUpdate }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      loadAppointmentsForDate();
    } else {
      loadAllAppointments();
    }
  }, [selectedDate]);

  const loadAppointmentsForDate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getByDate(selectedDate);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadAllAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === id ? { ...apt, status } : apt
        )
      );
      toast.success(`Appointment ${status} successfully`);
      onAppointmentUpdate?.();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <SkeletonLoader count={3} height="h-4" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={selectedDate ? loadAppointmentsForDate : loadAllAppointments}
      />
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState 
        icon="Calendar"
        title="No appointments found"
        description={selectedDate 
          ? `No appointments scheduled for ${format(selectedDate, 'MMMM d, yyyy')}`
          : "No appointments scheduled"
        }
        actionLabel="Schedule Appointment"
        onAction={() => {/* Handle create appointment */}}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900">
          {selectedDate 
            ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}`
            : 'All Appointments'
          }
        </h3>
        <Badge variant="primary">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {appointments.map((appointment, index) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-surface-900">{appointment.patientName}</h4>
                  <p className="text-sm text-surface-600">{appointment.doctorName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-sm text-surface-600">
                  <ApperIcon name="Clock" size={16} className="mr-2" />
                  {format(new Date(appointment.dateTime), 'h:mm a')}
                </div>
                <div className="flex items-center text-sm text-surface-600">
                  <ApperIcon name="Stethoscope" size={16} className="mr-2" />
                  {appointment.specialization}
                </div>
                <div className="flex items-center text-sm text-surface-600">
                  <ApperIcon name="FileText" size={16} className="mr-2" />
                  {appointment.reason}
                </div>
                <div className="flex items-center">
                  <Badge variant={appointment.status}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>

              {appointment.notes && (
                <div className="mt-4 p-3 bg-surface-50 rounded-md">
                  <p className="text-sm text-surface-700">{appointment.notes}</p>
                </div>
              )}
            </div>

            {appointment.status === 'scheduled' && (
              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AppointmentList;
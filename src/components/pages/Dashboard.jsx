import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import AppointmentList from '@/components/organisms/AppointmentList';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { appointmentService, patientService, doctorService, billService } from '@/services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
    pendingBills: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointments, patients, doctors, bills, todayApts] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
        billService.getPendingBills(),
        appointmentService.getTodaysAppointments()
      ]);

      setStats({
        todayAppointments: todayApts.length,
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        pendingBills: bills.length
      });

      setTodayAppointments(todayApts);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-600 mt-1">Welcome to MediFlow Hospital Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm"
            >
              <SkeletonLoader count={2} />
            </motion.div>
          ))
        ) : (
          <>
            <StatCard
              title="Today's Appointments"
              value={stats.todayAppointments}
              icon="Calendar"
              color="primary"
              trend="up"
              trendValue="+12% from yesterday"
            />
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon="Users"
              color="success"
              trend="up"
              trendValue="+5 new this week"
            />
            <StatCard
              title="Active Doctors"
              value={stats.totalDoctors}
              icon="Stethoscope"
              color="secondary"
            />
            <StatCard
              title="Pending Bills"
              value={stats.pendingBills}
              icon="CreditCard"
              color="warning"
              trend="down"
              trendValue="-3 from last week"
            />
          </>
        )}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-surface-900">Today's Appointments</h2>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-surface-200 rounded-lg">
                <SkeletonLoader count={3} />
              </div>
            ))}
          </div>
        ) : (
          <AppointmentList 
            selectedDate={new Date()} 
            onAppointmentUpdate={loadDashboardData}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 text-white cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Schedule Appointment</h3>
              <p className="text-sm opacity-90">Book a new appointment</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <motion.div whileHover={{ rotate: 15 }}>
                📅
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-success to-success/80 rounded-lg p-6 text-white cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Add Patient</h3>
              <p className="text-sm opacity-90">Register new patient</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <motion.div whileHover={{ rotate: 15 }}>
                👤
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-secondary to-secondary/80 rounded-lg p-6 text-white cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Generate Bill</h3>
              <p className="text-sm opacity-90">Create new invoice</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <motion.div whileHover={{ rotate: 15 }}>
                💳
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
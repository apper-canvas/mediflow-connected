import { useState } from 'react';
import { motion } from 'framer-motion';
import AppointmentCalendar from '@/components/organisms/AppointmentCalendar';
import AppointmentList from '@/components/organisms/AppointmentList';
import NewAppointmentModal from '@/components/organisms/NewAppointmentModal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  const handleAppointmentUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const handleAppointmentCreated = () => {
    setShowNewAppointmentModal(false);
    handleAppointmentUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
          <p className="text-surface-600 mt-1">Manage patient appointments and schedules</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'calendar' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="List" size={16} className="mr-2" />
              List
            </button>
          </div>
<Button variant="primary" onClick={handleNewAppointment}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <AppointmentCalendar
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>
            
            {/* Appointments List */}
            <div className="lg:col-span-2">
              <AppointmentList
                key={`${selectedDate}-${refreshTrigger}`}
                selectedDate={selectedDate}
                onAppointmentUpdate={handleAppointmentUpdate}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-none">
            <AppointmentList
              key={refreshTrigger}
              onAppointmentUpdate={handleAppointmentUpdate}
            />
          </div>
        )}
      </motion.div>

      {/* Floating Action Button (Mobile) */}
<div className="fixed bottom-6 right-6 md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNewAppointment}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <ApperIcon name="Plus" size={24} />
        </motion.button>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSuccess={handleAppointmentCreated}
        preselectedDate={selectedDate}
      />
    </div>
  );
};

export default Appointments;
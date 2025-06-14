import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DoctorCard from '@/components/organisms/DoctorCard';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { doctorService, userService } from '@/services';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchQuery, doctors]);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const [doctorData, userData] = await Promise.all([
        doctorService.getAll(),
        userService.getByRole('doctor')
      ]);

      // Merge doctor data with user data
      const mergedDoctors = doctorData.map(doctor => {
        const user = userData.find(u => u.id === doctor.userId);
        return {
          ...doctor,
          name: user?.name || 'Unknown',
          email: user?.email || 'No email',
          phone: user?.phone || 'No phone'
        };
      });

      setDoctors(mergedDoctors);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    try {
      const searchResults = await doctorService.getBySpecialization(searchQuery);
      const userData = await userService.getByRole('doctor');
      
      const mergedResults = searchResults.map(doctor => {
        const user = userData.find(u => u.id === doctor.userId);
        return {
          ...doctor,
          name: user?.name || 'Unknown',
          email: user?.email || 'No email',
          phone: user?.phone || 'No phone'
        };
      });

      setFilteredDoctors(mergedResults);
    } catch (error) {
      toast.error('Search failed');
    }
  };

const handleAddDoctor = () => {
    setShowAddModal(true);
  };

  const handleAddDoctorSuccess = () => {
    setShowAddModal(false);
    loadDoctors();
    toast.success('Doctor added successfully');
  };

  const handleViewProfile = (doctor) => {
    toast.info(`Viewing profile for ${doctor.name}`);
  };

  const handleManageSchedule = (doctor) => {
    toast.info(`Managing schedule for ${doctor.name}`);
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-surface-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-64"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 p-6"
            >
              <SkeletonLoader count={4} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDoctors} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Doctors</h1>
          <p className="text-surface-600 mt-1">Manage doctor profiles and schedules</p>
        </div>
        
<Button variant="primary" onClick={handleAddDoctor}>
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Doctor
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search doctors by name or specialization..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 && !loading ? (
        <EmptyState 
          icon="Stethoscope"
          title={searchQuery ? "No doctors found" : "No doctors registered"}
          description={searchQuery 
            ? `No doctors match "${searchQuery}"`
            : "Start by adding your first doctor"
          }
actionLabel={searchQuery ? undefined : "Add Doctor"}
          onAction={searchQuery ? undefined : handleAddDoctor}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DoctorCard
                doctor={doctor}
                onViewProfile={handleViewProfile}
                onManageSchedule={handleManageSchedule}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Action Button (Mobile) */}
<div className="fixed bottom-6 right-6 md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
          onClick={handleAddDoctor}
        >
          <ApperIcon name="UserPlus" size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default Doctors;
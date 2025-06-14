import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PatientCard from '@/components/organisms/PatientCard';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import FileUpload from '@/components/organisms/FileUpload';
import PatientFormModal from '@/components/organisms/PatientFormModal';
import { patientService, userService } from '@/services';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientData, userData] = await Promise.all([
        patientService.getAll(),
        userService.getByRole('patient')
      ]);

      // Merge patient data with user data
      const mergedPatients = patientData.map(patient => {
        const user = userData.find(u => u.id === patient.userId);
        return {
          ...patient,
          name: user?.name || 'Unknown',
          email: user?.email || 'No email',
          phone: user?.phone || 'No phone'
        };
      });

      setPatients(mergedPatients);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    try {
      const searchResults = await patientService.search(searchQuery);
      const userData = await userService.getByRole('patient');
      
      const mergedResults = searchResults.map(patient => {
        const user = userData.find(u => u.id === patient.userId);
        return {
          ...patient,
          name: user?.name || 'Unknown',
          email: user?.email || 'No email',
          phone: user?.phone || 'No phone'
        };
      });

      setFilteredPatients(mergedResults);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleViewDetails = (patient) => {
    toast.info(`Viewing details for ${patient.name}`);
  };

const handleEditPatient = (patient) => {
    toast.info(`Editing ${patient.name}`);
  };

  const handleUploadFiles = (patient) => {
    setSelectedPatient(patient);
    setShowFileUpload(true);
  };

  const handleFileUploadSuccess = () => {
    setShowFileUpload(false);
    setSelectedPatient(null);
// Refresh the page to update report counts
    loadPatients();
  };

  const handleAddPatient = () => {
    setShowAddModal(true);
  };

  const handleAddPatientSuccess = () => {
    loadPatients();
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
    return <ErrorState message={error} onRetry={loadPatients} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Patients</h1>
          <p className="text-surface-600 mt-1">Manage patient records and information</p>
        </div>
        
<Button variant="primary" onClick={handleAddPatient}>
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search patients by name, email, or phone..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 && !loading ? (
        <EmptyState 
          icon="Users"
          title={searchQuery ? "No patients found" : "No patients registered"}
          description={searchQuery 
            ? `No patients match "${searchQuery}"`
            : "Start by registering your first patient"
          }
actionLabel={searchQuery ? undefined : "Add Patient"}
          onAction={searchQuery ? undefined : handleAddPatient}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PatientCard
                patient={patient}
                onViewDetails={handleViewDetails}
                onEditPatient={handleEditPatient}
                onUploadFiles={handleUploadFiles}
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
          onClick={handleAddPatient}
        >
          <ApperIcon name="UserPlus" size={24} />
        </motion.button>
      </div>

      {/* File Upload Modal */}
      {showFileUpload && selectedPatient && (
        <FileUpload
          patientId={selectedPatient.userId}
          onSuccess={handleFileUploadSuccess}
onClose={() => {
            setShowFileUpload(false);
            setSelectedPatient(null);
          }}
        />
      )}

      {/* Add Patient Modal */}
      <PatientFormModal
        isOpen={showAddModal}
onClose={() => setShowAddModal(false)}
        onSuccess={handleAddPatientSuccess}
      />
    </div>
  );
};

export default Patients;
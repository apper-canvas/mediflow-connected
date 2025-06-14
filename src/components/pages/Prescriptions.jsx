import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import PrescriptionForm from '@/components/organisms/PrescriptionForm';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { prescriptionService } from '@/services';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = prescriptions.filter(prescription =>
        prescription.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.medicines?.some(med => 
          med.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredPrescriptions(filtered);
    } else {
      setFilteredPrescriptions(prescriptions);
    }
  }, [searchQuery, prescriptions]);

  const loadPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await prescriptionService.getAll();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions');
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadPrescriptions();
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleDownloadPrescription = (prescription) => {
    toast.success(`Downloading prescription for ${prescription.patientName}`);
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
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg border border-surface-200 p-6"
            >
              <SkeletonLoader count={3} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadPrescriptions} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Prescriptions</h1>
          <p className="text-surface-600 mt-1">Manage patient prescriptions and medications</p>
        </div>
        
        <Button variant="primary" onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Prescription
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <PrescriptionForm
          appointmentId="sample-appointment"
          patientId="sample-patient"
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Search Bar */}
      {!showCreateForm && (
        <div className="max-w-md">
          <SearchBar
            placeholder="Search prescriptions by patient, doctor, or medicine..."
            onSearch={setSearchQuery}
          />
        </div>
      )}

      {/* Prescriptions List */}
      {!showCreateForm && (
        <>
          {filteredPrescriptions.length === 0 && !loading ? (
            <EmptyState 
              icon="FileText"
              title={searchQuery ? "No prescriptions found" : "No prescriptions created"}
              description={searchQuery 
                ? `No prescriptions match "${searchQuery}"`
                : "Start by creating your first prescription"
              }
              actionLabel={searchQuery ? undefined : "Create Prescription"}
              onAction={searchQuery ? undefined : () => setShowCreateForm(true)}
            />
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription, index) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="FileText" size={24} className="text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-900">{prescription.patientName}</h3>
                        <p className="text-sm text-surface-600">By {prescription.doctorName}</p>
                        <p className="text-xs text-surface-500">
                          {format(new Date(prescription.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  </div>

                  {/* Medicines */}
                  <div className="mb-4">
                    <h4 className="font-medium text-surface-900 mb-2">Prescribed Medicines</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prescription.medicines?.map((medicine, idx) => (
                        <div key={idx} className="p-3 bg-surface-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-surface-900">{medicine.name}</span>
                            <Badge variant="primary" size="xs">{medicine.dosage}</Badge>
                          </div>
                          <p className="text-sm text-surface-600">{medicine.frequency}</p>
                          <p className="text-xs text-surface-500">Duration: {medicine.duration}</p>
                          {medicine.instructions && (
                            <p className="text-xs text-surface-500 mt-1 italic">{medicine.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Instructions */}
                  {prescription.instructions && (
                    <div className="mb-4 p-3 bg-info/5 border border-info/20 rounded-lg">
                      <h4 className="font-medium text-surface-900 mb-1 flex items-center">
                        <ApperIcon name="Info" size={16} className="mr-2 text-info" />
                        General Instructions
                      </h4>
                      <p className="text-sm text-surface-700">{prescription.instructions}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleViewPrescription(prescription)}
                    >
                      <ApperIcon name="Eye" size={16} className="mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPrescription(prescription)}
                    >
                      <ApperIcon name="Download" size={16} className="mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPrescription(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">Prescription Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPrescription(null)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-surface-600">Patient</label>
                    <p className="text-surface-900">{selectedPrescription.patientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600">Doctor</label>
                    <p className="text-surface-900">{selectedPrescription.doctorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600">Date</label>
                    <p className="text-surface-900">
                      {format(new Date(selectedPrescription.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600">Status</label>
                    <div className="mt-1">
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-surface-900 mb-3">Prescribed Medicines</h3>
                  <div className="space-y-3">
                    {selectedPrescription.medicines?.map((medicine, idx) => (
                      <div key={idx} className="p-4 border border-surface-200 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-surface-600">Medicine</label>
                            <p className="text-surface-900">{medicine.name}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-surface-600">Dosage</label>
                            <p className="text-surface-900">{medicine.dosage}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-surface-600">Frequency</label>
                            <p className="text-surface-900">{medicine.frequency}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-surface-600">Duration</label>
                            <p className="text-surface-900">{medicine.duration}</p>
                          </div>
                        </div>
                        {medicine.instructions && (
                          <div className="mt-2">
                            <label className="text-xs font-medium text-surface-600">Instructions</label>
                            <p className="text-surface-700 text-sm">{medicine.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPrescription.instructions && (
                  <div>
                    <label className="text-sm font-medium text-surface-600">General Instructions</label>
                    <p className="text-surface-900 mt-1">{selectedPrescription.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreateForm(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <ApperIcon name="Plus" size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default Prescriptions;
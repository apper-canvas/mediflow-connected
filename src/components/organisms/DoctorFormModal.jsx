import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { doctorService, userService } from '@/services';

const DoctorFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // First create user account
      const userData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'doctor',
        id: Date.now().toString()
      };

      const newUser = await userService.create(userData);

      // Then create doctor profile
      const doctorData = {
        userId: newUser.id,
        specialization: data.specialization,
        qualifications: data.qualifications,
        experience: parseInt(data.experience),
        consultationFee: parseFloat(data.consultationFee),
        availability: {
          monday: { available: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          tuesday: { available: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          wednesday: { available: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          thursday: { available: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          friday: { available: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          saturday: { available: true, slots: ['09:00', '10:00', '11:00'] },
          sunday: { available: false, slots: [] }
        }
      };

      await doctorService.create(doctorData);
      
      reset();
      onSuccess();
      toast.success('Doctor added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={handleClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-surface-900">Add New Doctor</h2>
                  <button
                    onClick={handleClose}
                    className="text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    label="Full Name"
                    error={errors.name?.message}
                    required
                  >
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter doctor's full name"
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    error={errors.email?.message}
                    required
                  >
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter email address"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    error={errors.phone?.message}
                    required
                  >
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter phone number"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[+]?[\d\s-()]+$/,
                          message: 'Please enter a valid phone number'
                        }
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Specialization"
                    error={errors.specialization?.message}
                    required
                  >
                    <select
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...register('specialization', { required: 'Specialization is required' })}
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Psychiatry">Psychiatry</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Qualifications"
                    error={errors.qualifications?.message}
                    required
                  >
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., MBBS, MD, PhD"
                      {...register('qualifications', { 
                        required: 'Qualifications are required',
                        minLength: { value: 2, message: 'Please enter valid qualifications' }
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Years of Experience"
                    error={errors.experience?.message}
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter years of experience"
                      {...register('experience', { 
                        required: 'Experience is required',
                        min: { value: 0, message: 'Experience cannot be negative' },
                        max: { value: 50, message: 'Please enter a valid experience' }
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Consultation Fee ($)"
                    error={errors.consultationFee?.message}
                    required
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter consultation fee"
                      {...register('consultationFee', { 
                        required: 'Consultation fee is required',
                        min: { value: 0, message: 'Fee cannot be negative' }
                      })}
                    />
                  </FormField>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      loading={loading}
                    >
                      {loading ? 'Adding...' : 'Add Doctor'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DoctorFormModal;
import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { prescriptionService } from '@/services';

const PrescriptionForm = ({ appointmentId, patientId, onSuccess, onCancel }) => {
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    setMedicines(medicines.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validMedicines = medicines.filter(med => med.name.trim());
    if (validMedicines.length === 0) {
      toast.error('Please add at least one medicine');
      return;
    }

    setLoading(true);
    try {
      await prescriptionService.create({
        appointmentId,
        patientId,
        medicines: validMedicines,
        instructions: generalInstructions
      });
      
      toast.success('Prescription created successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg border border-surface-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900">Create Prescription</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ApperIcon name="X" size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-surface-900">Medicines</h4>
            <Button type="button" variant="outline" size="sm" onClick={addMedicine}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Medicine
            </Button>
          </div>

          <div className="space-y-4">
            {medicines.map((medicine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-surface-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-surface-700">Medicine {index + 1}</h5>
                  {medicines.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedicine(index)}
                    >
                      <ApperIcon name="Trash2" size={16} className="text-error" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Medicine Name"
                    value={medicine.name}
                    onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                    placeholder="Enter medicine name"
                    required
                  />
                  <Input
                    label="Dosage"
                    value={medicine.dosage}
                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                    placeholder="e.g., 500mg"
                    required
                  />
                  <Input
                    label="Frequency"
                    value={medicine.frequency}
                    onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                    placeholder="e.g., Twice daily"
                    required
                  />
                  <Input
                    label="Duration"
                    value={medicine.duration}
                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                    placeholder="e.g., 7 days"
                    required
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Special Instructions"
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    placeholder="e.g., Take with food"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            General Instructions
          </label>
          <textarea
            value={generalInstructions}
            onChange={(e) => setGeneralInstructions(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Additional instructions for the patient..."
          />
        </div>

        <div className="flex space-x-3">
          <Button type="submit" loading={loading} className="flex-1">
            Create Prescription
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PrescriptionForm;
import { motion } from 'framer-motion';
import { differenceInYears } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const PatientCard = ({ patient, onViewDetails, onEditPatient }) => {
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">{patient.name}</h3>
            <p className="text-sm text-surface-600">{patient.email}</p>
          </div>
        </div>
        <Badge variant="primary" size="sm">
          Patient
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Phone" size={16} className="mr-2" />
          {patient.phone}
        </div>
        
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Calendar" size={16} className="mr-2" />
          Age: {age} years
        </div>
        
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Droplet" size={16} className="mr-2" />
          Blood Group: {patient.bloodGroup}
        </div>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="flex items-start text-sm text-surface-600">
            <ApperIcon name="AlertTriangle" size={16} className="mr-2 mt-0.5" />
            <div>
              <span className="font-medium">Allergies: </span>
              {patient.allergies.join(', ')}
            </div>
          </div>
        )}

        <div className="flex items-start text-sm text-surface-600">
          <ApperIcon name="UserCheck" size={16} className="mr-2 mt-0.5" />
          <div>
            <span className="font-medium">Emergency Contact: </span>
            {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
            <br />
            <span className="text-surface-500">{patient.emergencyContact?.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-6">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onViewDetails?.(patient)}
          className="flex-1"
        >
          <ApperIcon name="Eye" size={16} className="mr-2" />
          View Details
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEditPatient?.(patient)}
        >
          <ApperIcon name="Edit" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default PatientCard;
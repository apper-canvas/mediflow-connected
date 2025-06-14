import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const DoctorCard = ({ doctor, onViewProfile, onManageSchedule }) => {
  const getAvailabilityCount = () => {
    if (!doctor.availability) return 0;
    return Object.values(doctor.availability).reduce((count, slots) => count + slots.length, 0);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="Stethoscope" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">{doctor.name}</h3>
            <p className="text-sm text-surface-600">{doctor.email}</p>
          </div>
        </div>
        <Badge variant="secondary" size="sm">
          Doctor
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Phone" size={16} className="mr-2" />
          {doctor.phone}
        </div>
        
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="GraduationCap" size={16} className="mr-2" />
          {doctor.specialization}
        </div>
        
        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="FileText" size={16} className="mr-2" />
          License: {doctor.licenseNumber}
        </div>

        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="DollarSign" size={16} className="mr-2" />
          Consultation Fee: ${doctor.consultationFee}
        </div>

        <div className="flex items-center text-sm text-surface-600">
          <ApperIcon name="Clock" size={16} className="mr-2" />
          {getAvailabilityCount()} available slots this week
        </div>
      </div>

      <div className="flex space-x-2 mt-6">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onViewProfile?.(doctor)}
          className="flex-1"
        >
          <ApperIcon name="Eye" size={16} className="mr-2" />
          View Profile
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onManageSchedule?.(doctor)}
        >
          <ApperIcon name="Calendar" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
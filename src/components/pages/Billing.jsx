import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import BillTable from '@/components/organisms/BillTable';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Billing = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Bills refreshed');
  };

  const handleCreateBill = () => {
    toast.info('Create bill functionality');
  };

  const handleExportBills = () => {
    toast.info('Export bills functionality');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Billing</h1>
          <p className="text-surface-600 mt-1">Manage invoices and payment tracking</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleRefresh}>
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Refresh
          </Button>
          <Button variant="ghost" onClick={handleExportBills}>
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={handleCreateBill}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Bill
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$12,450"
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+15% this month"
        />
        <StatCard
          title="Pending Bills"
          value="23"
          icon="Clock"
          color="warning"
          trend="down"
          trendValue="-5 from last week"
        />
        <StatCard
          title="Paid Bills"
          value="156"
          icon="CheckCircle"
          color="success"
          trend="up"
          trendValue="+8 this week"
        />
        <StatCard
          title="Overdue Bills"
          value="7"
          icon="AlertTriangle"
          color="error"
          trend="down"
          trendValue="-2 from last week"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={handleCreateBill}
          className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-left hover:bg-primary/10 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-surface-900">Create New Bill</h3>
              <p className="text-sm text-surface-600">Generate invoice for patient</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => toast.info('Payment tracking functionality')}
          className="p-4 bg-success/5 border border-success/20 rounded-lg text-left hover:bg-success/10 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CreditCard" size={20} className="text-success" />
            </div>
            <div>
              <h3 className="font-medium text-surface-900">Track Payments</h3>
              <p className="text-sm text-surface-600">Monitor payment status</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => toast.info('Generate reports functionality')}
          className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg text-left hover:bg-secondary/10 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="BarChart3" size={20} className="text-secondary" />
            </div>
            <div>
              <h3 className="font-medium text-surface-900">Generate Report</h3>
              <p className="text-sm text-surface-600">Financial analytics</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bills Table */}
      <div>
        <BillTable key={refreshTrigger} refreshTrigger={refreshTrigger} />
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCreateBill}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <ApperIcon name="Plus" size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default Billing;
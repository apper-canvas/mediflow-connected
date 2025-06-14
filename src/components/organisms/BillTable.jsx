import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { billService } from '@/services';

const BillTable = ({ refreshTrigger }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadBills();
  }, [refreshTrigger]);

  const loadBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billService.getAll();
      setBills(data);
    } catch (err) {
      setError(err.message || 'Failed to load bills');
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const updateBillStatus = async (id, status) => {
    try {
      await billService.updateStatus(id, status);
      setBills(prev => 
        prev.map(bill => 
          bill.id === id ? { ...bill, status, paidAt: status === 'paid' ? new Date().toISOString() : undefined } : bill
        )
      );
      toast.success(`Bill marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update bill status');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBills = [...bills].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (sortField === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
        <div className="p-6">
          <SkeletonLoader count={5} height="h-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadBills} />;
  }

  if (bills.length === 0) {
    return (
      <EmptyState 
        icon="CreditCard"
        title="No bills found"
        description="No billing records available"
        actionLabel="Create Bill"
        onAction={() => {/* Handle create bill */}}
      />
    );
  }

  const SortHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ApperIcon 
          name={sortField === field 
            ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown')
            : 'ChevronsUpDown'
          } 
          size={14}
          className={sortField === field ? 'text-primary' : 'text-surface-400'}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <SortHeader field="id">Bill ID</SortHeader>
              <SortHeader field="patientName">Patient</SortHeader>
              <SortHeader field="amount">Amount</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="createdAt">Created</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {sortedBills.map((bill, index) => (
              <motion.tr
                key={bill.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-surface-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900">
                  #{bill.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <ApperIcon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-surface-900">{bill.patientName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 font-semibold">
                  ${bill.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={bill.status}>
                    {bill.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                  {format(new Date(bill.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {bill.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => updateBillStatus(bill.id, 'paid')}
                    >
                      Mark Paid
                    </Button>
                  )}
                  {bill.status === 'paid' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBillStatus(bill.id, 'pending')}
                    >
                      Mark Pending
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                  >
                    <ApperIcon name="Download" size={16} />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillTable;
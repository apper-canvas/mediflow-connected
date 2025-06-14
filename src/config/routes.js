import Dashboard from '@/components/pages/Dashboard';
import Appointments from '@/components/pages/Appointments';
import Patients from '@/components/pages/Patients';
import Doctors from '@/components/pages/Doctors';
import Billing from '@/components/pages/Billing';
import Prescriptions from '@/components/pages/Prescriptions';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
    component: Appointments
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
    component: Patients
  },
  doctors: {
    id: 'doctors',
    label: 'Doctors',
    path: '/doctors',
    icon: 'Stethoscope',
    component: Doctors
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    path: '/billing',
    icon: 'CreditCard',
    component: Billing
  },
  prescriptions: {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/prescriptions',
    icon: 'FileText',
    component: Prescriptions
  }
};

export const routeArray = Object.values(routes);
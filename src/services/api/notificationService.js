import notificationsData from '@/services/mockData/notifications.json';
import appointmentService from './appointmentService';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

class NotificationService {
  constructor() {
    this.notifications = [...notificationsData];
    this.preferences = {
      appointments: true,
      reminders: true,
      system: true,
      email: false,
      push: true,
      reminderTime: 30 // minutes before appointment
    };
  }

  async getNotifications() {
    return new Promise((resolve) => {
setTimeout(async () => {
        try {
          // Get upcoming appointments for notifications
          const appointments = await appointmentService.getAll();
          const upcomingAppointments = appointments
            .filter(apt => {
              if (!apt?.dateTime) return false;
              const aptDate = new Date(apt.dateTime);
              const now = new Date();
              const daysDiff = Math.ceil((aptDate - now) / (1000 * 60 * 60 * 24));
              return daysDiff >= 0 && daysDiff <= 7; // Next 7 days
            })
            .map(apt => ({
              id: `apt-${apt.id}`,
              type: 'appointment',
              title: `Upcoming Appointment`,
              message: `${apt.patientName || 'Patient'} - ${format(new Date(apt.dateTime), 'h:mm a')}`,
              time: apt.dateTime,
              read: false,
              priority: isToday(new Date(apt.dateTime)) ? 'high' : 'medium',
              data: apt
            }));
const allNotifications = [
            ...this.notifications,
            ...upcomingAppointments
          ].sort((a, b) => new Date(b.time) - new Date(a.time));

          resolve(allNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          resolve([...this.notifications]);
        }
      }, 300);
    });
  }

  async getUnreadCount() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const notifications = await this.getNotifications();
        const unreadCount = notifications.filter(n => !n.read).length;
        resolve(unreadCount);
      }, 200);
    });
  }

  async markAsRead(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
        resolve(notification);
      }, 200);
    });
  }

  async markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.notifications.forEach(n => n.read = true);
        resolve(this.notifications);
      }, 300);
    });
  }

  async deleteNotification(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        resolve(true);
      }, 200);
    });
  }

  async getPreferences() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.preferences });
      }, 200);
    });
  }

  async updatePreferences(newPreferences) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.preferences = { ...this.preferences, ...newPreferences };
        resolve(this.preferences);
      }, 300);
    });
  }

  async createReminder(reminder) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReminder = {
          id: `reminder-${Date.now()}`,
          type: 'reminder',
          title: reminder.title,
          message: reminder.message,
          time: reminder.time,
          read: false,
          priority: reminder.priority || 'medium',
          recurring: reminder.recurring || false
        };
        this.notifications.push(newReminder);
        resolve(newReminder);
      }, 300);
    });
  }

  formatNotificationTime(time) {
    const date = new Date(time);
    const now = new Date();
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  }
}

export const notificationService = new NotificationService();
// NotificationContext: Demonstrates Context API for transient UI feedback & alerts
// Syllabus Topic: Context API & Scoped State Architecture
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { initialNotifications } from '../data/notifications';

const NotificationContext = createContext(null);

const defaultPreferences = {
  upcomingDeadlines: true,
  inAppTips: true,
  weeklyDigest: false,
};

export function NotificationProvider({ children }) {
  // Toast notification state
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error' | 'info'

  // Persisted notifications feed
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('welfora-notifications');
      return stored ? JSON.parse(stored) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  // User reminder preferences
  const [reminderPreferences, setReminderPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem('welfora-reminder-preferences');
      return stored ? JSON.parse(stored) : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  // Helper to trigger transient toast feedback
  const notify = useCallback((message, type = 'success') => {
    setToast(message);
    setToastType(type);
    window.setTimeout(() => setToast(''), 3000);
  }, []);

  // Filtered notifications based on user preferences
  const visibleNotifications = useMemo(() => {
    return notifications
      .filter(n => n.kind !== 'deadline' || reminderPreferences.upcomingDeadlines)
      .filter(n => n.kind !== 'general' || reminderPreferences.inAppTips);
  }, [notifications, reminderPreferences]);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => {
      const next = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('welfora-notifications', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const dismissAllNotifications = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.setItem('welfora-notifications', JSON.stringify([]));
    } catch {}
  }, []);

  const restoreNotifications = useCallback(() => {
    setNotifications(initialNotifications);
    try {
      localStorage.setItem('welfora-notifications', JSON.stringify(initialNotifications));
    } catch {}
    notify('Demo notifications restored');
  }, [notify]);

  const updatePreferences = useCallback((newPrefs) => {
    setReminderPreferences(prev => {
      const next = typeof newPrefs === 'function' ? newPrefs(prev) : { ...prev, ...newPrefs };
      try {
        localStorage.setItem('welfora-reminder-preferences', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = {
    toast,
    toastType,
    notify,
    notifications,
    setNotifications,
    visibleNotifications,
    reminderPreferences,
    setReminderPreferences: updatePreferences,
    dismissNotification,
    dismissAllNotifications,
    restoreNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

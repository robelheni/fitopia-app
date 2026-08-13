import { createContext, useContext, useState, useCallback } from 'react';
import { getUnreadNotificationCount } from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadNotificationCount();
      setUnreadCount(data.count ?? 0);
    } catch {
      // fail silently — badge just stays at last value
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

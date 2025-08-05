import React, { useState, useEffect } from 'react';
import NotificationSystem from '../utils/notifications';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = NotificationSystem.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const getNotificationStyles = (type) => {
    const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border transform transition-all duration-300 ease-in-out max-w-md";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50/90 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50/90 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50/90 border-yellow-200 text-yellow-800`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={getNotificationStyles(notification.type)}
          style={{
            top: `${1 + index * 5}rem`,
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </span>
            <div className="flex-1">
              <p className="font-medium text-sm leading-relaxed">
                {notification.message}
              </p>
              <p className="text-xs opacity-70 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => NotificationSystem.remove(notification.id)}
              className="text-current opacity-50 hover:opacity-100 transition-opacity ml-2 text-lg leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

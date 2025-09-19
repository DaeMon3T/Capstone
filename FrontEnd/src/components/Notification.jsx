// components/Notification.jsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Notification = ({ type, message, onClose, duration = 5000, position = 'top-right' }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getNotificationStyles = () => {
    const baseStyles = "fixed z-[9999] max-w-md w-full bg-white rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out";
    
    const positionStyles = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    return `${baseStyles} ${positionStyles[position]}`;
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          icon: CheckCircle
        };
      case 'error':
        return {
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          icon: XCircle
        };
      case 'warning':
        return {
          borderColor: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          icon: AlertTriangle
        };
      case 'info':
      default:
        return {
          borderColor: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          icon: Info
        };
    }
  };

  const typeStyles = getTypeStyles();
  const IconComponent = typeStyles.icon;

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Info';
    }
  };

  return (
    <div className={`${getNotificationStyles()} ${typeStyles.borderColor}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${typeStyles.iconBg} flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 ${typeStyles.iconColor}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${typeStyles.titleColor}`}>
              {getTitle()}
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              {message}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="h-1 bg-gray-100 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            } animate-pulse`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Notification;
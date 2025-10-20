import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose, 
  duration = 4000 
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
  };

  const colors = {
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-600 text-white',
    error: 'bg-red-600 text-white'
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors[type]} px-6 py-4 rounded-md shadow-lg animate-slide-in-right max-w-sm`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs mt-1 opacity-90">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
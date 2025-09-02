import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in milliseconds, default to 3000
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('slide-in-notification');

  useEffect(() => {
    setIsVisible(true); // Show immediately when component mounts

    const timer = setTimeout(() => {
      setAnimationClass('slide-out-notification');
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 500); // Match the animation duration
      return () => clearTimeout(fadeOutTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeClasses = {
    success: 'bg-green-600 border-green-800',
    error: 'bg-red-600 border-red-800',
    info: 'bg-blue-600 border-blue-800',
    warning: 'bg-yellow-600 border-yellow-800',
  };

  const iconClasses = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle',
  };

  return (
    <div className={`fixed top-16 right-4 w-80 p-4 rounded-lg shadow-xl text-white z-50 border-l-8 ${typeClasses[type]} ${animationClass}`}>
      <div className="flex items-center">
        <i className={`fas ${iconClasses[type]} text-2xl mr-3`}></i>
        <p className="flex-grow text-lg font-semibold">{message}</p>
        <button onClick={() => { setAnimationClass('slide-out-notification'); setTimeout(() => { setIsVisible(false); onClose(); }, 500); }} className="ml-4 text-xl font-bold opacity-75 hover:opacity-100 transition-opacity">
          &times;
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
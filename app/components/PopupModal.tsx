import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface PopupModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const PopupModal: React.FC<PopupModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const isMobile = useMobileDetection();
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-white ${isMobile ? 'p-4 mx-4 max-w-xs' : 'p-6 max-w-sm'} w-full rounded-lg shadow-xl`}>
        <h2 className={`${isMobile ? 'text-lg mb-3' : 'text-xl mb-4'} font-bold text-gray-900`}>{title}</h2>
        <p className={`text-gray-700 ${isMobile ? 'mb-4 text-sm' : 'mb-6'}`}>{message}</p>
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-end space-x-4'}`}>
          <button
            onClick={onCancel}
            className={`${isMobile ? 'w-full px-3 py-2 text-sm' : 'px-4 py-2'} bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${isMobile ? 'w-full px-3 py-2 text-sm' : 'px-4 py-2'} bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
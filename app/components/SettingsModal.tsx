import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSave: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetSave }) => {
  const isMobile = useMobileDetection();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-white ${isMobile ? 'p-4 mx-4 max-w-xs' : 'p-6 max-w-sm'} w-full rounded-lg shadow-xl`}>
        <h2 className={`${isMobile ? 'text-lg mb-3' : 'text-xl mb-4'} font-bold text-gray-900`}>Settings</h2>
        <div className="space-y-3">
          <button
            onClick={onResetSave}
            className={`w-full ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-red-600 text-white rounded hover:bg-red-700 transition-colors`}
          >
            Reset Save
          </button>
          <button
            onClick={onClose}
            className={`w-full ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
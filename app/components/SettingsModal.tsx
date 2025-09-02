import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSave: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Settings</h2>
        <div className="space-y-4">
          <button
            onClick={onResetSave}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reset Save
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
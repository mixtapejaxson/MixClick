import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSave: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'dark' | 'light' | 'blue';
  onChangeTheme: (theme: 'dark' | 'light' | 'blue') => void;
  autoSaveEnabled: boolean;
  onToggleAutoSave: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onResetSave, 
  soundEnabled, 
  onToggleSound,
  theme,
  onChangeTheme,
  autoSaveEnabled,
  onToggleAutoSave
}) => {
  const isMobile = useMobileDetection();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-white ${isMobile ? 'p-4 mx-4 max-w-xs' : 'p-6 max-w-md'} w-full rounded-lg shadow-xl max-h-screen overflow-y-auto`}>
        <h2 className={`${isMobile ? 'text-lg mb-3' : 'text-xl mb-4'} font-bold text-gray-900`}>Settings</h2>
        
        {/* Game Options Section */}
        <div className="space-y-4 mb-4">
          <div className="border-b border-gray-300 pb-2">
            <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-700 mb-2`}>Game Options</h3>
          </div>
          
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <label className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700`}>Sound Effects</label>
            <button
              onClick={onToggleSound}
              className={`${isMobile ? 'w-12 h-6' : 'w-14 h-7'} rounded-full transition-colors ${
                soundEnabled ? 'bg-green-500' : 'bg-gray-400'
              } relative`}
            >
              <span
                className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} bg-white rounded-full absolute top-0.5 transition-transform ${
                  soundEnabled ? (isMobile ? 'translate-x-6' : 'translate-x-7') : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Auto-Save Toggle */}
          <div className="flex items-center justify-between">
            <label className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700`}>Auto-Save</label>
            <button
              onClick={onToggleAutoSave}
              className={`${isMobile ? 'w-12 h-6' : 'w-14 h-7'} rounded-full transition-colors ${
                autoSaveEnabled ? 'bg-green-500' : 'bg-gray-400'
              } relative`}
            >
              <span
                className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} bg-white rounded-full absolute top-0.5 transition-transform ${
                  autoSaveEnabled ? (isMobile ? 'translate-x-6' : 'translate-x-7') : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Theme Selector */}
          <div>
            <label className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 block mb-2`}>Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChangeTheme('dark')}
                className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} rounded transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-2 border-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => onChangeTheme('light')}
                className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} rounded transition-colors ${
                  theme === 'light'
                    ? 'bg-white text-gray-800 border-2 border-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onChangeTheme('blue')}
                className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'} rounded transition-colors ${
                  theme === 'blue'
                    ? 'bg-blue-600 text-white border-2 border-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Blue
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="space-y-3 border-t border-gray-300 pt-4">
          <div className="border-b border-gray-300 pb-2">
            <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-red-600 mb-2`}>Danger Zone</h3>
          </div>
          <button
            onClick={onResetSave}
            className={`w-full ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-red-600 text-white rounded hover:bg-red-700 transition-colors`}
          >
            Reset Save
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-4">
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
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`bg-gradient-to-br from-white via-gray-50 to-gray-100 w-full rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto border border-gray-200 ${
        isMobile ? 'p-4 max-w-sm mx-2' : 'p-6 sm:p-8 max-w-md sm:max-w-lg'
      }`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg sm:text-xl">⚙️</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all text-gray-600 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>
        
        {/* Game Options Section */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">Game Options</h3>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
          </div>
          
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl">🔊</span>
              <div>
                <label className="text-sm sm:text-base text-gray-900 font-semibold block">Sound Effects</label>
                <span className="text-xs text-gray-500">Enable audio feedback</span>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                soundEnabled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 focus:ring-green-500 shadow-lg shadow-green-500/30' 
                  : 'bg-gray-300 focus:ring-gray-400'
              }`}
              aria-label="Toggle Sound Effects"
              aria-checked={soundEnabled}
              role="switch"
            >
              <span
                className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                  soundEnabled 
                    ? 'translate-x-5 sm:translate-x-7 ring-2 ring-green-400' 
                    : 'translate-x-0.5 ring-2 ring-gray-200'
                }`}
              >
                {soundEnabled && (
                  <span className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs">
                    ✓
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Auto-Save Toggle */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl">💾</span>
              <div>
                <label className="text-sm sm:text-base text-gray-900 font-semibold block">Auto-Save</label>
                <span className="text-xs text-gray-500">Save every 30 seconds</span>
              </div>
            </div>
            <button
              onClick={onToggleAutoSave}
              className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-14 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                autoSaveEnabled 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-500 shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-300 focus:ring-gray-400'
              }`}
              aria-label="Toggle Auto-Save"
              aria-checked={autoSaveEnabled}
              role="switch"
            >
              <span
                className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                  autoSaveEnabled 
                    ? 'translate-x-5 sm:translate-x-7 ring-2 ring-blue-400' 
                    : 'translate-x-0.5 ring-2 ring-gray-200'
                }`}
              >
                {autoSaveEnabled && (
                  <span className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs">
                    ✓
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className="p-2.5 sm:p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <label className="text-sm sm:text-base text-gray-800 font-medium block mb-2 sm:mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => onChangeTheme('dark')}
                className={`px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => onChangeTheme('light')}
                className={`px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-white to-gray-100 text-gray-800 ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-50 hover:to-gray-150'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => onChangeTheme('blue')}
                className={`px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  theme === 'blue'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500'
                }`}
              >
                💙 Blue
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent flex-1"></div>
            <h3 className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">⚠️ Danger Zone</h3>
            <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent flex-1"></div>
          </div>
          <button
            onClick={onResetSave}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🗑️ Reset Save
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl font-bold hover:from-gray-300 hover:to-gray-400 transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
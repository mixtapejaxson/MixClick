import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { abbreviateNumber } from '../utils/numberFormatter';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: string;
  category: 'clicks' | 'cash' | 'upgrades' | 'special';
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  const isMobile = useMobileDetection();
  
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = ((unlockedCount / totalCount) * 100).toFixed(1);

  const categoryColors = {
    clicks: 'from-red-500 to-orange-500',
    cash: 'from-green-500 to-emerald-500',
    upgrades: 'from-blue-500 to-cyan-500',
    special: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white ${
        isMobile 
          ? 'p-5 mx-2 max-w-sm h-5/6' 
          : 'p-8 max-w-5xl max-h-5/6'
      } w-full rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-500/30`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent`}>
                Achievements
              </h2>
              <p className="text-sm text-gray-400">
                {unlockedCount}/{totalCount} Unlocked ({completionPercentage}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all text-gray-300 hover:text-white text-2xl font-bold shadow-lg`}
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto h-full pb-20">
          <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
            {achievements.map(achievement => {
              const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
              return (
                <div
                  key={achievement.id}
                  className={`relative ${
                    isMobile ? 'p-4' : 'p-5'
                  } bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-lg border-2 ${
                    achievement.unlocked 
                      ? 'border-yellow-400/50 bg-gradient-to-br from-yellow-900/20 to-amber-900/20' 
                      : 'border-gray-600/30'
                  } transition-all`}
                >
                  {achievement.unlocked && (
                    <div className="absolute top-2 right-2">
                      <span className="text-2xl">✅</span>
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${categoryColors[achievement.category]} rounded-xl flex items-center justify-center text-2xl ${
                      !achievement.unlocked ? 'opacity-50' : ''
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-white mb-1 ${
                        !achievement.unlocked ? 'opacity-70' : ''
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 ${
                        !achievement.unlocked ? 'opacity-70' : ''
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  
                  {!achievement.unlocked && (
                    <>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Progress: {abbreviateNumber(achievement.progress)}/{abbreviateNumber(achievement.maxProgress)}
                      </p>
                    </>
                  )}
                  
                  <div className={`mt-3 pt-3 border-t border-gray-700 ${isMobile ? 'text-xs' : 'text-sm'} text-green-400 font-semibold`}>
                    🎁 Reward: {achievement.reward}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-purple-500/30 ${
          isMobile ? 'p-4' : 'p-5'
        } backdrop-blur-md`}>
          <button
            onClick={onClose}
            className={`${
              isMobile ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base'
            } bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg w-full`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;

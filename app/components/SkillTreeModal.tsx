import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { abbreviateNumber } from '../utils/numberFormatter';

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  prerequisite?: string; // ID of skill that must be unlocked first
  category: 'click' | 'idle' | 'economy';
  effect: (level: number) => void;
}

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillPoints: number;
  skills: Skill[];
  onUnlockSkill: (skillId: string) => void;
}

const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  isOpen,
  onClose,
  skillPoints,
  skills,
  onUnlockSkill,
}) => {
  const isMobile = useMobileDetection();
  
  if (!isOpen) return null;

  const categoryColors = {
    click: 'from-red-500 to-orange-500',
    idle: 'from-blue-500 to-cyan-500',
    economy: 'from-green-500 to-emerald-500',
  };

  const categoryIcons = {
    click: '👆',
    idle: '⚙️',
    economy: '💰',
  };

  const categories: Array<'click' | 'idle' | 'economy'> = ['click', 'idle', 'economy'];

  const isSkillUnlockable = (skill: Skill) => {
    if (skill.currentLevel >= skill.maxLevel) return false;
    if (skillPoints < skill.cost) return false;
    if (skill.prerequisite) {
      const prereq = skills.find(s => s.id === skill.prerequisite);
      if (!prereq || prereq.currentLevel === 0) return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white ${
        isMobile 
          ? 'p-5 mx-2 max-w-sm h-5/6' 
          : 'p-8 max-w-6xl max-h-5/6'
      } w-full rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-500/30`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌳</span>
            </div>
            <div>
              <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent`}>
                Skill Tree
              </h2>
              <p className="text-sm text-gray-400">Available Skill Points: <span className="text-yellow-400 font-bold">{skillPoints}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all text-gray-300 hover:text-white text-2xl font-bold shadow-lg`}
          >
            ×
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto h-full pb-20">
          <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
            {categories.map(category => {
              const categorySkills = skills.filter(s => s.category === category);
              return (
                <div key={category} className={`bg-gradient-to-br ${categoryColors[category]}/10 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl shadow-2xl border-2 border-${category === 'click' ? 'red' : category === 'idle' ? 'blue' : 'green'}-500/50 backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[category]} rounded-xl flex items-center justify-center`}>
                      <span className="text-xl">{categoryIcons[category]}</span>
                    </div>
                    <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-white capitalize`}>
                      {category}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {categorySkills.map(skill => {
                      const unlockable = isSkillUnlockable(skill);
                      const maxed = skill.currentLevel >= skill.maxLevel;
                      return (
                        <div
                          key={skill.id}
                          className={`p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-lg border-2 ${
                            maxed ? 'border-yellow-400/50' : 
                            unlockable ? 'border-green-400/50' : 
                            'border-gray-600/30'
                          } transition-all`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white`}>
                              {skill.name}
                            </span>
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} px-2 py-1 rounded-lg ${
                              maxed ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-blue-500/20 text-blue-300'
                            } font-semibold`}>
                              {skill.currentLevel}/{skill.maxLevel}
                            </span>
                          </div>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 mb-3`}>
                            {skill.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-300 font-semibold`}>
                              💎 {skill.cost} SP
                            </span>
                            <button
                              onClick={() => onUnlockSkill(skill.id)}
                              disabled={!unlockable}
                              className={`${
                                isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                              } bg-gradient-to-r ${
                                maxed ? 'from-yellow-500 to-yellow-600' :
                                unlockable ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                                'from-gray-600 to-gray-700'
                              } text-white font-bold rounded-lg transition-all shadow-lg disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0`}
                            >
                              {maxed ? 'Maxed' : skill.currentLevel > 0 ? 'Upgrade' : 'Unlock'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
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

export default SkillTreeModal;

import React from 'react';
import { abbreviateNumber } from '../utils/numberFormatter';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface TopBarProps {
  onSaveGame: () => void;
  onLoadGame: () => void;
  onRebirth: () => void;
  onOpenSettings: () => void;
  onOpenSkillTree: () => void;
  onOpenStatistics: () => void;
  onOpenAchievements: () => void;
  clicks: number;
  cash: number;
  rebirths: number;
  prestigeCurrency: number;
  skillPoints: number;
  canRebirth: boolean;
}

export default function TopBar({ onSaveGame, onLoadGame, onRebirth, onOpenSettings, onOpenSkillTree, onOpenStatistics, onOpenAchievements, clicks, cash, rebirths, prestigeCurrency, skillPoints, canRebirth }: TopBarProps) {
  const isMobile = useMobileDetection();

  if (isMobile) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-b-2 border-blue-500">
        {/* Top row with buttons */}
        <div className="flex justify-between items-center p-3 gap-2">
          <div className="flex space-x-2 overflow-x-auto">
            <button onClick={onSaveGame} className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">💾</button>
            <button onClick={onLoadGame} className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">📂</button>
            <button onClick={onOpenSkillTree} className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">🌳</button>
            <button onClick={onOpenAchievements} className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">🏆</button>
            <button onClick={onOpenStatistics} className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">📊</button>
          </div>
          <div className="flex space-x-2">
            {canRebirth && (
              <button onClick={onRebirth} className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">🔄</button>
            )}
            <button onClick={onOpenSettings} className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">⚙️</button>
          </div>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 p-3 pt-0">
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-2 border border-blue-700/50">
            <p className="text-xs text-blue-300 font-medium">Clicks</p>
            <p className="text-sm font-bold text-white">{abbreviateNumber(clicks)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-lg p-2 border border-green-700/50">
            <p className="text-xs text-green-300 font-medium">Cash</p>
            <p className="text-sm font-bold text-white">${abbreviateNumber(cash)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-2 border border-purple-700/50">
            <p className="text-xs text-purple-300 font-medium">Skill Points</p>
            <p className="text-sm font-bold text-white">{abbreviateNumber(skillPoints)}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 rounded-lg p-2 border border-yellow-700/50">
            <p className="text-xs text-yellow-300 font-medium">Prestige</p>
            <p className="text-sm font-bold text-white">{abbreviateNumber(prestigeCurrency)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-b-2 border-blue-500">
      <div className="flex space-x-3">
        <button onClick={onSaveGame} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">💾 Save</button>
        <button onClick={onLoadGame} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">📂 Load</button>
        <button onClick={onOpenSkillTree} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">🌳 Skills</button>
        <button onClick={onOpenAchievements} className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">🏆 Achievements</button>
        <button onClick={onOpenStatistics} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">📊 Stats</button>
      </div>
      <div className="flex space-x-6 items-center justify-center flex-grow">
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-xl border border-blue-700/50 min-w-[100px]">
          <p className="text-xs text-blue-300 font-medium mb-1">Clicks</p>
          <p className="text-lg font-bold text-white">{abbreviateNumber(clicks)}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-green-900/40 to-green-800/40 rounded-xl border border-green-700/50 min-w-[100px]">
          <p className="text-xs text-green-300 font-medium mb-1">Cash</p>
          <p className="text-lg font-bold text-white">${abbreviateNumber(cash)}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-xl border border-purple-700/50 min-w-[100px]">
          <p className="text-xs text-purple-300 font-medium mb-1">Skill Points</p>
          <p className="text-lg font-bold text-white">{abbreviateNumber(skillPoints)}</p>
        </div>
        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 rounded-xl border border-yellow-700/50 min-w-[100px]">
          <p className="text-xs text-yellow-300 font-medium mb-1">Prestige</p>
          <p className="text-lg font-bold text-white">{abbreviateNumber(prestigeCurrency)}</p>
        </div>
      </div>
      <div className="flex space-x-3 items-center">
        {canRebirth && (
          <button onClick={onRebirth} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">🔄 Rebirth</button>
        )}
        <button onClick={onOpenSettings} className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">⚙️ Settings</button>
      </div>
    </div>
  );
}
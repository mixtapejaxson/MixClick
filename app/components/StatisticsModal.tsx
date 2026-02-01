import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { abbreviateNumber } from '../utils/numberFormatter';

export interface Statistics {
  totalClicks: number;
  totalCashEarned: number;
  totalUpgradesPurchased: number;
  totalLuckyCratesOpened: number;
  totalRebirths: number;
  totalPlayTime: number; // in seconds
  highestCash: number;
  highestClickPower: number;
  highestAutoClickers: number;
}

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: Statistics;
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  statistics,
}) => {
  const isMobile = useMobileDetection();
  
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const stats = [
    { icon: '👆', label: 'Total Clicks', value: abbreviateNumber(statistics.totalClicks), color: 'from-red-500 to-orange-500' },
    { icon: '💰', label: 'Total Cash Earned', value: `$${abbreviateNumber(statistics.totalCashEarned)}`, color: 'from-green-500 to-emerald-500' },
    { icon: '📦', label: 'Upgrades Purchased', value: abbreviateNumber(statistics.totalUpgradesPurchased), color: 'from-blue-500 to-cyan-500' },
    { icon: '🎁', label: 'Lucky Crates Opened', value: abbreviateNumber(statistics.totalLuckyCratesOpened), color: 'from-yellow-500 to-orange-500' },
    { icon: '🔄', label: 'Total Rebirths', value: abbreviateNumber(statistics.totalRebirths), color: 'from-purple-500 to-pink-500' },
    { icon: '⏱️', label: 'Total Play Time', value: formatTime(statistics.totalPlayTime), color: 'from-indigo-500 to-blue-500' },
    { icon: '💵', label: 'Highest Cash', value: `$${abbreviateNumber(statistics.highestCash)}`, color: 'from-emerald-500 to-green-600' },
    { icon: '⚡', label: 'Highest Click Power', value: abbreviateNumber(statistics.highestClickPower), color: 'from-yellow-500 to-amber-500' },
    { icon: '🤖', label: 'Highest Auto Clickers', value: abbreviateNumber(statistics.highestAutoClickers), color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white ${
        isMobile 
          ? 'p-5 mx-2 max-w-sm h-5/6' 
          : 'p-8 max-w-4xl max-h-5/6'
      } w-full rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-500/30`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent`}>
              Statistics
            </h2>
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
          <div className={`${isMobile ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color}/10 border-2 border-${stat.color.split('-')[1]}-500/30 ${isMobile ? 'p-4' : 'p-5'} rounded-2xl shadow-lg backdrop-blur-sm hover:border-${stat.color.split('-')[1]}-500/60 transition-all`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 font-medium`}>
                    {stat.label}
                  </p>
                </div>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-black text-white ml-13`}>
                  {stat.value}
                </p>
              </div>
            ))}
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

export default StatisticsModal;

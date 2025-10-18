import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { abbreviateNumber } from '../utils/numberFormatter';

interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  cost: number;
  effect: () => void;
  count: number;
  description: string;
}

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  cash: number;
  upgrades: Upgrade[];
  onPurchaseUpgrade: (upgradeId: string) => void;
  luckyCrateCost: number;
  onPurchaseLuckyCrate: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  cash,
  upgrades,
  onPurchaseUpgrade,
  luckyCrateCost,
  onPurchaseLuckyCrate,
}) => {
  const isMobile = useMobileDetection();
  
  if (!isOpen) return null;

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
              <span className="text-2xl">🛒</span>
            </div>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent`}>
              Shop
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
          <div className={`${isMobile ? 'space-y-5' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}`}>
            
            {/* Shop Upgrades Section */}
            <div className={`bg-gradient-to-br from-blue-900/30 to-blue-800/30 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl shadow-2xl border-2 border-blue-500/50 backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⬆️</span>
                </div>
                <h3 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-blue-300`}>
                  Upgrades
                </h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {upgrades.map(upgrade => (
                  <div 
                    key={upgrade.id} 
                    className={`flex ${
                      isMobile ? 'flex-col space-y-2' : 'flex-col sm:flex-row justify-between items-start'
                    } p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-lg border-2 border-blue-400/30 hover:border-blue-400/60 transition-all hover:shadow-blue-500/20`}
                  >
                    <div className="text-left flex-grow">
                      <span className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white block mb-2`}>
                        {upgrade.name}
                      </span>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 mb-2`}>
                        {upgrade.description}
                      </p>
                      <div className="flex gap-4">
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-300 font-semibold`}>
                          💰 ${abbreviateNumber(upgrade.cost)}
                        </p>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-300 font-semibold`}>
                          📦 {abbreviateNumber(upgrade.count)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onPurchaseUpgrade(upgrade.id)}
                      disabled={cash < upgrade.cost}
                      className={`${
                        isMobile ? 'w-full px-4 py-2.5 text-sm' : 'px-5 py-3 ml-4 mt-2'
                      } bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex-shrink-0 transform hover:-translate-y-0.5 active:translate-y-0`}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lucky Crates Section */}
            <div className={`bg-gradient-to-br from-yellow-900/30 to-orange-800/30 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl shadow-2xl border-2 border-yellow-500/50 backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎁</span>
                </div>
                <h3 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black text-yellow-300`}>
                  Lucky Crates
                </h3>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-xl border border-yellow-500/30 mb-4">
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-200 leading-relaxed`}>
                  🎲 Take a chance! Lucky crates can give you amazing rewards... or terrible consequences!
                </p>
              </div>
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-yellow-500/30 mb-6">
                <p className={`${isMobile ? 'text-base' : 'text-lg'} text-yellow-100`}>
                  Cost: <span className="font-black text-2xl text-yellow-300">${abbreviateNumber(luckyCrateCost)}</span>
                </p>
              </div>
              <button
                className={`w-full ${
                  isMobile ? 'px-6 py-4 text-base' : 'px-8 py-5 text-xl'
                } bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-black rounded-2xl hover:from-yellow-600 hover:to-orange-700 transition-all shadow-2xl hover:shadow-yellow-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0`}
                onClick={onPurchaseLuckyCrate}
                disabled={cash < luckyCrateCost}
              >
                🎁 Buy Lucky Crate
              </button>
            </div>
          </div>
        </div>

        {/* Footer with cash display */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-purple-500/30 ${
          isMobile ? 'p-4' : 'p-5'
        } backdrop-blur-md`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Your Balance</p>
                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-black text-green-400`}>
                  ${abbreviateNumber(cash)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`${
                isMobile ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base'
              } bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
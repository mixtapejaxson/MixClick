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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-gray-900 text-white ${
        isMobile 
          ? 'p-4 mx-4 max-w-sm h-5/6' 
          : 'p-6 max-w-4xl max-h-5/6'
      } w-full rounded-lg shadow-xl overflow-hidden`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
          <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-blue-400`}>
            Shop
          </h2>
          <button
            onClick={onClose}
            className={`${isMobile ? 'text-2xl p-1' : 'text-3xl p-2'} text-gray-400 hover:text-white transition-colors`}
          >
            ×
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto h-full pb-16">
          <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
            
            {/* Shop Upgrades Section */}
            <div className={`bg-gray-800 ${isMobile ? 'p-4' : 'p-6'} rounded-lg shadow-xl border border-blue-400`}>
              <h3 className={`${isMobile ? 'text-lg mb-3' : 'text-2xl mb-5'} font-bold text-blue-400`}>
                Upgrades
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {upgrades.map(upgrade => (
                  <div 
                    key={upgrade.id} 
                    className={`flex ${
                      isMobile ? 'flex-col space-y-2' : 'flex-col sm:flex-row justify-between items-center'
                    } p-3 bg-gray-700 rounded-md shadow-sm border border-blue-300`}
                  >
                    <div className="text-left flex-grow">
                      <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-white`}>
                        {upgrade.name}
                      </span>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 mt-1`}>
                        {upgrade.description}
                      </p>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-200 mt-1`}>
                        Cost: ${abbreviateNumber(upgrade.cost)} | Owned: {abbreviateNumber(upgrade.count)}
                      </p>
                    </div>
                    <button
                      onClick={() => onPurchaseUpgrade(upgrade.id)}
                      disabled={cash < upgrade.cost}
                      className={`${
                        isMobile ? 'w-full px-3 py-2 text-sm' : 'px-4 py-2 ml-4'
                      } bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex-shrink-0`}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lucky Crates Section */}
            <div className={`bg-gray-800 ${isMobile ? 'p-4' : 'p-6'} rounded-lg shadow-xl border border-yellow-400`}>
              <h3 className={`${isMobile ? 'text-lg mb-3' : 'text-2xl mb-5'} font-bold text-yellow-400`}>
                Lucky Crates
              </h3>
              <p className={`${isMobile ? 'text-sm mb-3' : 'text-lg mb-4'} text-gray-300`}>
                Take a chance! Lucky crates can give you amazing rewards... or terrible consequences!
              </p>
              <p className={`${isMobile ? 'text-base mb-4' : 'text-lg mb-6'}`}>
                Cost: <span className="font-semibold text-yellow-300">${abbreviateNumber(luckyCrateCost)}</span>
              </p>
              <button
                className={`w-full ${
                  isMobile ? 'px-4 py-3 text-sm' : 'px-6 py-4 text-lg'
                } bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed`}
                onClick={onPurchaseLuckyCrate}
                disabled={cash < luckyCrateCost}
              >
                Buy Lucky Crate
              </button>
            </div>
          </div>
        </div>

        {/* Footer with cash display */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 ${
          isMobile ? 'p-3' : 'p-4'
        }`}>
          <div className="flex justify-between items-center">
            <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-green-400`}>
              Cash: ${abbreviateNumber(cash)}
            </div>
            <button
              onClick={onClose}
              className={`${
                isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
              } bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors`}
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
import React, { useEffect, useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import NotificationModal from './NotificationModal';
import PopupModal from './PopupModal';
import ShopModal from './ShopModal';
import { abbreviateNumber } from '../utils/numberFormatter';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  cost: number;
  effect: () => void;
  count: number;
  description: string;
}

interface CookieClickerGameProps {
  clicks: number;
  setClicks: Dispatch<SetStateAction<number>>;
  cash: number;
  setCash: Dispatch<SetStateAction<number>>;
  clickPower: number;
  setClickPower: Dispatch<SetStateAction<number>>;
  autoClickers: number;
  setAutoClickers: Dispatch<SetStateAction<number>>;
  luckyCrateCost: number;
  setLuckyCrateCost: Dispatch<SetStateAction<number>>;
  rebirths: number;
  setRebirths: Dispatch<SetStateAction<number>>;
  prestigeCurrency: number;
  setPrestigeCurrency: Dispatch<SetStateAction<number>>;
  upgrades: Upgrade[];
  setUpgrades: Dispatch<SetStateAction<Upgrade[]>>;
  notification: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  setNotification: Dispatch<SetStateAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>>;
  popup: { title: string; message: string; onConfirm: () => void; onCancel: () => void } | null;
  setPopup: Dispatch<SetStateAction<{ title: string; message: string; onConfirm: () => void; onCancel: () => void } | null>>;
  initialUpgrades: Upgrade[];
  onOpenCasino: () => void;
}

export default function CookieClickerGame({
  clicks, setClicks, cash, setCash, clickPower, setClickPower,
  autoClickers, setAutoClickers, luckyCrateCost, setLuckyCrateCost,
  rebirths, setRebirths, prestigeCurrency, setPrestigeCurrency,
  upgrades, setUpgrades, notification, setNotification, popup, setPopup,
  initialUpgrades, onOpenCasino
}: CookieClickerGameProps) {
  const isMobile = useMobileDetection();
  const [showShopModal, setShowShopModal] = useState(false);

  const handleCookieClick = () => {
    // Apply prestige multiplier: 1% bonus per prestige currency
    const prestigeMultiplier = 1 + (prestigeCurrency * 0.01);
    const effectiveClickPower = Math.floor(clickPower * prestigeMultiplier);
    setClicks(prevClicks => prevClicks + effectiveClickPower);
    // Lucky crates are now purchased, not random on click
  };

  const convertClicksToCash = () => {
    const conversionRate = 0.1 + (rebirths * 0.01); // Base 10% + 1% per rebirth
    setCash(prevCash => prevCash + (clicks * conversionRate));
    setClicks(0);
  };

  const purchaseUpgrade = (upgradeId: string) => {
    setUpgrades(prevUpgrades => {
      const updatedUpgrades = prevUpgrades.map(upgrade => {
        if (upgrade.id === upgradeId) {
          if (cash >= upgrade.cost) {
            setCash(prevCash => Math.max(0, prevCash - upgrade.cost));
            upgrade.effect();
            setNotification({ message: `Purchased ${upgrade.name}!`, type: 'success' });
            return { ...upgrade, count: upgrade.count + 1, cost: Math.round(upgrade.baseCost * Math.pow(1.15, upgrade.count + 1)) };
          } else {
            setNotification({ message: 'Not enough cash!', type: 'error' });
          }
        }
        return upgrade;
      });
      return updatedUpgrades;
    });
  };

  // Auto clicker effect with prestige multiplier
  useEffect(() => {
    const interval = setInterval(() => {
      // Apply prestige multiplier: 1% bonus per prestige currency
      const prestigeMultiplier = 1 + (prestigeCurrency * 0.01);
      const effectiveAutoClickers = Math.floor(autoClickers * prestigeMultiplier);
      setClicks(prevClicks => prevClicks + effectiveAutoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers, prestigeCurrency, setClicks]);

  const purchaseLuckyCrate = () => {
    if (cash >= luckyCrateCost) {
      setCash(prevCash => Math.max(0, prevCash - luckyCrateCost));
      setLuckyCrateCost(prevCost => Math.round(prevCost * 1.2)); // Dynamic pricing
      triggerLuckyCrate();
    } else {
      setNotification({ message: 'Not enough cash to buy a Lucky Crate!', type: 'error' });
    }
  };

  const triggerLuckyCrate = () => {
    const outcomes = [
      // Good outcomes
      { name: 'Big Cash Boost!', effect: () => setCash(prevCash => prevCash + luckyCrateCost * 2), type: 'success' },
      { name: 'Click Power Surge!', effect: () => setClickPower(prev => prev + 10), type: 'success' },
      { name: 'Auto Clicker Bonus!', effect: () => setAutoClickers(prev => prev + 2), type: 'success' },
      { name: 'Prestige Currency!', effect: () => setPrestigeCurrency(prev => prev + 1), type: 'success' },
      // Bad outcomes
      { name: 'Lost some Cash!', effect: () => setCash(prevCash => Math.max(0, prevCash - luckyCrateCost / 2)), type: 'error' },
      { name: 'Click Power Drain!', effect: () => setClickPower(prev => Math.max(1, prev - 2)), type: 'error' },
      { name: 'Auto Clicker Malfunction!', effect: () => setAutoClickers(prev => Math.max(0, prev - 1)), type: 'error' },
    ];

    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    setNotification({ message: `Lucky Crate! You got: ${randomOutcome.name}`, type: randomOutcome.type as 'success' | 'error' | 'info' | 'warning' });
    randomOutcome.effect();
  };

  // Calculate prestige multiplier
  const prestigeMultiplier = 1 + (prestigeCurrency * 0.01);

  return (
    <div className={`flex flex-col items-center justify-center flex-grow ${isMobile ? 'p-4' : 'p-8'} min-h-screen`} onContextMenu={(e) => e.preventDefault()}>
      {/* Logo/Title */}
      <div className="mb-8 text-center">
        <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse`}>
          MixClick
        </h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-400 font-medium`}>The Ultimate Idle Clicker Experience</p>
      </div>
      <title>MixClick</title>
      
      {/* Prestige Multiplier Display */}
      {prestigeCurrency > 0 && (
        <div className={`${isMobile ? 'text-sm mb-4 px-4 py-2' : 'text-lg mb-6 px-6 py-3'} bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 rounded-xl backdrop-blur-sm`}>
          <span className="text-yellow-300 font-bold">✨ Prestige Multiplier: </span>
          <span className="text-yellow-100 font-black text-xl">{prestigeMultiplier.toFixed(2)}x</span>
        </div>
      )}
      
      {/* Main click button */}
      <button
        className={`${isMobile ? 'w-48 h-48 text-2xl' : 'w-64 h-64 text-4xl'} bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white font-black rounded-full shadow-2xl hover:shadow-blue-500/50 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-110 active:scale-95 mb-8 border-4 border-white/20 relative overflow-hidden group`}
        onClick={handleCookieClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <span className="relative z-10">🎯 Click Me!</span>
      </button>
      
      {/* Action Buttons Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-3 w-full max-w-xs' : 'grid-cols-3 gap-4 w-full max-w-3xl'}`}>
        {/* Convert button */}
        <button
          className={`${isMobile ? 'px-6 py-4' : 'px-8 py-5'} bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-green-500/50 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1 active:translate-y-0`}
          onClick={convertClicksToCash}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">💰</span>
            <span className={isMobile ? 'text-sm' : 'text-base'}>Convert to Cash</span>
          </div>
        </button>

        {/* Shop button */}
        <button
          className={`${isMobile ? 'px-6 py-4' : 'px-8 py-5'} bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-purple-500/50 hover:from-purple-600 hover:to-purple-800 transition-all transform hover:-translate-y-1 active:translate-y-0`}
          onClick={() => setShowShopModal(true)}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className={isMobile ? 'text-sm' : 'text-base'}>Shop</span>
          </div>
        </button>

        {/* Casino button */}
        <button
          className={`${isMobile ? 'px-6 py-4' : 'px-8 py-5'} bg-gradient-to-br from-yellow-500 to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-yellow-500/50 hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:-translate-y-1 active:translate-y-0`}
          onClick={onOpenCasino}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎰</span>
            <span className={isMobile ? 'text-sm' : 'text-base'}>Casino</span>
          </div>
        </button>
      </div>

      {/* Stats Display */}
      <div className={`mt-8 grid ${isMobile ? 'grid-cols-2 gap-3 w-full max-w-xs' : 'grid-cols-4 gap-4 w-full max-w-3xl'}`}>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-xs text-blue-300 font-medium mb-1">Click Power</p>
          <p className="text-xl font-bold text-white">{abbreviateNumber(Math.floor(clickPower * prestigeMultiplier))}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-xs text-green-300 font-medium mb-1">Auto Clickers</p>
          <p className="text-xl font-bold text-white">{abbreviateNumber(Math.floor(autoClickers * prestigeMultiplier))}/s</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-xs text-purple-300 font-medium mb-1">Conversion Rate</p>
          <p className="text-xl font-bold text-white">{((0.1 + (rebirths * 0.01)) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-3 backdrop-blur-sm">
          <p className="text-xs text-yellow-300 font-medium mb-1">Crate Cost</p>
          <p className="text-xl font-bold text-white">${abbreviateNumber(luckyCrateCost)}</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="fixed top-40 right-20 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Shop Modal */}
      <ShopModal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        cash={cash}
        upgrades={upgrades}
        onPurchaseUpgrade={purchaseUpgrade}
        luckyCrateCost={luckyCrateCost}
        onPurchaseLuckyCrate={purchaseLuckyCrate}
      />
    </div>
  );
}
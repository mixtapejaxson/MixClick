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
    <div className={`flex flex-col items-center justify-center flex-grow ${isMobile ? 'p-2' : 'p-4'} bg-gray-900 text-white min-h-screen`} onContextMenu={(e) => e.preventDefault()}>
      <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-4 text-blue-400`}>MixClick</h1>
      <title>MixClick</title>
      
      {/* Prestige Multiplier Display */}
      {prestigeCurrency > 0 && (
        <div className={`${isMobile ? 'text-sm mb-2' : 'text-base mb-3'} text-yellow-400 font-semibold`}>
          Prestige Multiplier: {prestigeMultiplier.toFixed(2)}x
        </div>
      )}
      
      {/* Main click button */}
      <button
        className={`${isMobile ? 'px-6 py-3 text-xl' : 'px-8 py-4 text-2xl'} bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-100 ease-in-out transform active:scale-95 mb-4`}
        onClick={handleCookieClick}
      >
        Click Me!
      </button>
      
      {/* Convert button */}
      <button
        className={`${isMobile ? 'px-4 py-2 text-base mb-4' : 'px-6 py-3 text-lg mb-6'} bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors`}
        onClick={convertClicksToCash}
      >
        Convert Clicks to Cash
      </button>

      {/* Shop button */}
      <button
        className={`${isMobile ? 'px-6 py-3 text-lg mb-4' : 'px-8 py-4 text-xl mb-6'} bg-purple-500 text-white font-bold rounded-lg shadow-lg hover:bg-purple-600 transition-colors`}
        onClick={() => setShowShopModal(true)}
      >
        Open Shop
      </button>

      {/* Casino button */}
      <button
        className={`${isMobile ? 'px-6 py-3 text-lg mb-6' : 'px-8 py-4 text-xl mb-8'} bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition-colors`}
        onClick={onOpenCasino}
      >
        🎰 Casino (Blackjack)
      </button>

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
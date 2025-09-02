import React, { useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import NotificationModal from './NotificationModal';
import PopupModal from './PopupModal';
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
}

export default function CookieClickerGame({
  clicks, setClicks, cash, setCash, clickPower, setClickPower,
  autoClickers, setAutoClickers, luckyCrateCost, setLuckyCrateCost,
  rebirths, setRebirths, prestigeCurrency, setPrestigeCurrency,
  upgrades, setUpgrades, notification, setNotification, popup, setPopup,
  initialUpgrades
}: CookieClickerGameProps) {

  const handleCookieClick = () => {
    setClicks(prevClicks => prevClicks + clickPower);
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

  // Auto clicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(prevClicks => prevClicks + autoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers, setClicks]);

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

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 bg-gray-900 text-white min-h-screen" onContextMenu={(e) => e.preventDefault()}>
      <h1 className="text-4xl font-bold mb-6 text-blue-400">MixClick</h1>
      <title>MixClick</title>
      <button
        className="px-8 py-4 bg-blue-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-100 ease-in-out transform active:scale-95 mb-6"
        onClick={handleCookieClick}
      >
        Click Me!
      </button>
      <button
        className="px-6 py-3 bg-green-500 text-white text-lg rounded-lg shadow hover:bg-green-600 transition-colors mb-10"
        onClick={convertClicksToCash}
      >
        Convert Clicks to Cash
      </button>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl border border-blue-400 mb-8">
        <h2 className="text-3xl font-bold mb-5 text-blue-400">Shop Upgrades</h2>
        <div className="space-y-4">
          {upgrades.map(upgrade => (
            <div key={upgrade.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-700 rounded-md shadow-sm border border-blue-300">
              <div className="text-left mb-2 sm:mb-0">
                <span className="text-lg font-semibold text-white">{upgrade.name}</span>
                <p className="text-sm text-gray-300">{upgrade.description}</p>
                <p className="text-sm text-blue-200">Cost: ${abbreviateNumber(upgrade.cost)} | Owned: {abbreviateNumber(upgrade.count)}</p>
              </div>
              <button
                onClick={() => purchaseUpgrade(upgrade.id)}
                disabled={cash < upgrade.cost}
                className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-xl border border-yellow-400">
        <h2 className="text-3xl font-bold mb-5 text-yellow-400">Lucky Crates</h2>
        <p className="text-lg mb-4">Cost: <span className="font-semibold text-yellow-300">${abbreviateNumber(luckyCrateCost)}</span></p>
        <button
          className="w-full px-5 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-md hover:bg-yellow-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          onClick={purchaseLuckyCrate}
          disabled={cash < luckyCrateCost}
        >
          Buy Lucky Crate
        </button>
      </div>
    </div>
  );
}
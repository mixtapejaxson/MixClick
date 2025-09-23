import React from 'react';
import { abbreviateNumber } from '../utils/numberFormatter';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface TopBarProps {
  onSaveGame: () => void;
  onLoadGame: () => void;
  onRebirth: () => void;
  onOpenSettings: () => void;
  clicks: number;
  cash: number;
  rebirths: number;
  prestigeCurrency: number;
}

export default function TopBar({ onSaveGame, onLoadGame, onRebirth, onOpenSettings, clicks, cash, rebirths, prestigeCurrency }: TopBarProps) {
  const isMobile = useMobileDetection();

  if (isMobile) {
    return (
      <div className="bg-gray-800 text-white shadow-md">
        {/* Top row with buttons */}
        <div className="flex justify-between items-center p-2">
          <div className="flex space-x-2">
            <button onClick={onSaveGame} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">Save</button>
            <button onClick={onLoadGame} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">Load</button>
          </div>
          <div className="flex space-x-2">
            <button onClick={onRebirth} className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">Rebirth</button>
            <button onClick={onOpenSettings} className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">Settings</button>
          </div>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-1 p-2 pt-0 text-xs">
          <p className="text-center">Clicks: <span className="font-semibold text-blue-300">{abbreviateNumber(clicks)}</span></p>
          <p className="text-center">Cash: <span className="font-semibold text-green-400">${abbreviateNumber(cash)}</span></p>
          <p className="text-center">Rebirths: <span className="font-semibold text-purple-300">{abbreviateNumber(rebirths)}</span></p>
          <p className="text-center">Prestige: <span className="font-semibold text-yellow-400">{abbreviateNumber(prestigeCurrency)}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <div className="flex space-x-4">
        <button onClick={onSaveGame} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Save</button>
        <button onClick={onLoadGame} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Load</button>
      </div>
      <div className="flex space-x-8 items-center justify-center flex-grow"> {/* Added justify-center and flex-grow */}
        <p>Clicks: <span className="font-semibold text-blue-300">{abbreviateNumber(clicks)}</span></p>
        <p>Cash: <span className="font-semibold text-green-400">${abbreviateNumber(cash)}</span></p>
        <p>Rebirths: <span className="font-semibold text-purple-300">{abbreviateNumber(rebirths)}</span></p>
        <p>Prestige Currency: <span className="font-semibold text-yellow-400">{abbreviateNumber(prestigeCurrency)}</span></p>
      </div>
      <div className="flex space-x-4 items-center">
        <button onClick={onRebirth} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Rebirth</button>
        <button onClick={onOpenSettings} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">Settings</button>
      </div>
    </div>
  );
}
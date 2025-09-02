import React from 'react';
import { abbreviateNumber } from '../utils/numberFormatter';

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
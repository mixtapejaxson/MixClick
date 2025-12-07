import React, { useState, useEffect, useCallback } from 'react';
import CookieClickerGame from "../components/CookieClickerGame";
import TopBar from "../components/TopBar";
import NotificationModal from '../components/NotificationModal';
import PopupModal from '../components/PopupModal';
import SettingsModal from '../components/SettingsModal';
import UpdateModal from '../components/UpdateModal';
import BlackjackModal from '../components/BlackjackModal';
import { checkForNewRelease, setLastSeenVersion } from '../utils/githubRelease';

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [cash, setCash] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [luckyCrateCost, setLuckyCrateCost] = useState(100); // Initial cost for a lucky crate
  const [rebirths, setRebirths] = useState(0);
  const [prestigeCurrency, setPrestigeCurrency] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBlackjackModal, setShowBlackjackModal] = useState(false);
  
  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'blue'>('dark');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const initialUpgrades = [
    { id: 'power', name: 'Increase Click Power', baseCost: 10, cost: 10, effect: () => setClickPower(prev => prev + 1), count: 0, description: 'Increases the number of clicks you get per click.' },
    { id: 'auto', name: 'Buy Auto Clicker', baseCost: 100, cost: 100, effect: () => setAutoClickers(prev => prev + 1), count: 0, description: 'Automatically clicks for you every second.' },
    { id: 'grandma', name: 'Grandma', baseCost: 1000, cost: 1000, effect: () => setAutoClickers(prev => prev + 10), count: 0, description: 'A nice grandma who bakes cookies for you.' },
    { id: 'farm', name: 'Farm', baseCost: 10000, cost: 10000, effect: () => setAutoClickers(prev => prev + 100), count: 0, description: 'A farm to grow more cookies.' },
    { id: 'mine', name: 'Mine', baseCost: 100000, cost: 100000, effect: () => setAutoClickers(prev => prev + 1000), count: 0, description: 'A mine to extract valuable cookie ore.' },
    { id: 'factory', name: 'Factory', baseCost: 1000000, cost: 1000000, effect: () => setAutoClickers(prev => prev + 10000), count: 0, description: 'A factory to mass produce cookies.' },
    { id: 'bank', name: 'Bank', baseCost: 10000000, cost: 10000000, effect: () => setAutoClickers(prev => prev + 100000), count: 0, description: 'A bank to store and generate interest on your cookies.' },
    { id: 'temple', name: 'Temple', baseCost: 100000000, cost: 100000000, effect: () => setAutoClickers(prev => prev + 1000000), count: 0, description: 'A temple to worship the cookie gods.' },
  ];
  const [upgrades, setUpgrades] = useState(initialUpgrades);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [popup, setPopup] = useState<{ title: string; message: string; onConfirm: () => void; onCancel: () => void } | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{ version: string; releaseNotes: string; htmlUrl: string } | null>(null);

  const saveGame = useCallback(() => {
    const gameState = {
      clicks,
      cash,
      clickPower,
      autoClickers,
      luckyCrateCost,
      rebirths,
      prestigeCurrency,
      upgrades,
      settings: {
        soundEnabled,
        theme,
        autoSaveEnabled,
      },
    };
    localStorage.setItem('cookieClickerGame', JSON.stringify(gameState));
    setNotification({ message: 'Game Saved!', type: 'success' });
  }, [clicks, cash, clickPower, autoClickers, luckyCrateCost, rebirths, prestigeCurrency, upgrades, soundEnabled, theme, autoSaveEnabled]);

  const loadGame = useCallback(() => {
    const savedState = localStorage.getItem('cookieClickerGame');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      setClicks(gameState.clicks);
      setCash(gameState.cash);
      setClickPower(gameState.clickPower);
      setAutoClickers(gameState.autoClickers);
      setLuckyCrateCost(gameState.luckyCrateCost);
      setRebirths(gameState.rebirths);
      setPrestigeCurrency(gameState.prestigeCurrency);
      
      // Load settings if they exist
      if (gameState.settings) {
        setSoundEnabled(gameState.settings.soundEnabled ?? true);
        setTheme(gameState.settings.theme ?? 'dark');
        setAutoSaveEnabled(gameState.settings.autoSaveEnabled ?? true);
      }
      
      // Re-assign effect functions to loaded upgrades
      const loadedUpgradesWithEffects = gameState.upgrades.map((loadedUpgrade: any) => {
        const initialUpgrade = initialUpgrades.find(iu => iu.id === loadedUpgrade.id);
        return initialUpgrade ? { ...loadedUpgrade, effect: initialUpgrade.effect } : loadedUpgrade;
      });
      setUpgrades(loadedUpgradesWithEffects);
      setNotification({ message: 'Game Loaded!', type: 'success' });
    } else {
      setNotification({ message: 'No saved game found!', type: 'info' });
    }
  }, []);

  useEffect(() => {
    loadGame(); // Load game on component mount
  }, [loadGame]);

  // Auto-save every 30 seconds if enabled
  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        saveGame();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, saveGame]);

  useEffect(() => {
    // Check for new releases
    const checkUpdates = async () => {
      const { isNewRelease, release } = await checkForNewRelease();
      if (isNewRelease && release) {
        setUpdateInfo({
          version: release.tag_name,
          releaseNotes: release.body,
          htmlUrl: release.html_url,
        });
        setShowUpdateModal(true);
      }
    };
    
    checkUpdates();
  }, []);

  const handleRebirth = () => {
    setRebirths(prev => prev + 1);
    setPrestigeCurrency(prev => prev + Math.floor(cash / 1000000)); // 1 prestige currency per 1,000,000 cash
    setClicks(0);
    setCash(0);
    setClickPower(1);
    setAutoClickers(0);
    setUpgrades(initialUpgrades); // Reset upgrades
    setNotification({ message: 'Rebirth successful! You gained prestige currency!', type: 'success' });
    setPopup(null);
  };

  const handleOpenSettings = () => {
    setShowSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setShowSettingsModal(false);
  };

  const handleResetSave = () => {
    localStorage.removeItem('cookieClickerGame');
    setClicks(0);
    setCash(0);
    setClickPower(1);
    setAutoClickers(0);
    setLuckyCrateCost(100);
    setRebirths(0);
    setPrestigeCurrency(0);
    setUpgrades(initialUpgrades);
    setSoundEnabled(true);
    setTheme('dark');
    setAutoSaveEnabled(true);
    setNotification({ message: 'Game progress reset!', type: 'success' });
    handleCloseSettings();
  };

  const handleBlackjackWin = (amount: number) => {
    setCash(prevCash => prevCash + amount);
    setNotification({ message: `Blackjack: Won $${amount}!`, type: 'success' });
  };

  const handleBlackjackLose = (amount: number) => {
    setCash(prevCash => Math.max(0, prevCash - amount));
  };

  const handleCloseUpdateModal = () => {
    if (updateInfo) {
      setLastSeenVersion(updateInfo.version);
    }
    setShowUpdateModal(false);
  };

  const canRebirth = cash >= 1000000; // User can rebirth if they have at least 1M cash

  // Theme classes
  const themeClasses = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-100 text-gray-900',
    blue: 'bg-blue-900 text-white',
  };

  return (
    <div className={`home-container ${themeClasses[theme]}`}>
      <TopBar
        onSaveGame={saveGame}
        onLoadGame={loadGame}
        onRebirth={() => setPopup({
          title: 'Rebirth Confirmation',
          message: 'Are you sure you want to Rebirth? You will lose all clicks, cash, and upgrades, but gain prestige currency!',
          onConfirm: handleRebirth,
          onCancel: () => setPopup(null),
        })}
        onOpenSettings={handleOpenSettings}
        clicks={clicks}
        cash={cash}
        rebirths={rebirths}
        prestigeCurrency={prestigeCurrency}
        canRebirth={canRebirth}
      />
      <CookieClickerGame
        clicks={clicks}
        setClicks={setClicks}
        cash={cash}
        setCash={setCash}
        clickPower={clickPower}
        setClickPower={setClickPower}
        autoClickers={autoClickers}
        setAutoClickers={setAutoClickers}
        luckyCrateCost={luckyCrateCost}
        setLuckyCrateCost={setLuckyCrateCost}
        rebirths={rebirths}
        setRebirths={setRebirths}
        prestigeCurrency={prestigeCurrency}
        setPrestigeCurrency={setPrestigeCurrency}
        upgrades={upgrades}
        setUpgrades={setUpgrades}
        notification={notification}
        setNotification={setNotification}
        popup={popup}
        setPopup={setPopup}
        initialUpgrades={initialUpgrades}
        onOpenCasino={() => setShowBlackjackModal(true)}
      />
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {popup && (
        <PopupModal
          title={popup.title}
          message={popup.message}
          onConfirm={popup.onConfirm}
          onCancel={popup.onCancel}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={handleCloseSettings}
        onResetSave={handleResetSave}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        theme={theme}
        onChangeTheme={setTheme}
        autoSaveEnabled={autoSaveEnabled}
        onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
      />

      <BlackjackModal
        isOpen={showBlackjackModal}
        onClose={() => setShowBlackjackModal(false)}
        cash={cash}
        onWin={handleBlackjackWin}
        onLose={handleBlackjackLose}
      />

      {showUpdateModal && updateInfo && (
        <UpdateModal
          isOpen={showUpdateModal}
          onClose={handleCloseUpdateModal}
          version={updateInfo.version}
          releaseNotes={updateInfo.releaseNotes}
          htmlUrl={updateInfo.htmlUrl}
        />
      )}
    </div>
  );
}

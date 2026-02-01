import React, { useState, useEffect, useCallback } from 'react';
import CookieClickerGame from "../components/CookieClickerGame";
import TopBar from "../components/TopBar";
import NotificationModal from '../components/NotificationModal';
import PopupModal from '../components/PopupModal';
import SettingsModal from '../components/SettingsModal';
import UpdateModal from '../components/UpdateModal';
import BlackjackModal from '../components/BlackjackModal';
import SkillTreeModal, { type Skill } from '../components/SkillTreeModal';
import StatisticsModal, { type Statistics } from '../components/StatisticsModal';
import AchievementsModal, { type Achievement } from '../components/AchievementsModal';
import { checkForNewRelease, setLastSeenVersion } from '../utils/githubRelease';

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [cash, setCash] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [luckyCrateCost, setLuckyCrateCost] = useState(100); // Initial cost for a lucky crate
  const [rebirths, setRebirths] = useState(0);
  const [prestigeCurrency, setPrestigeCurrency] = useState(0);
  const [skillPoints, setSkillPoints] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBlackjackModal, setShowBlackjackModal] = useState(false);
  const [showSkillTreeModal, setShowSkillTreeModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  
  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'blue'>('dark');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Statistics state
  const [statistics, setStatistics] = useState<Statistics>({
    totalClicks: 0,
    totalCashEarned: 0,
    totalUpgradesPurchased: 0,
    totalLuckyCratesOpened: 0,
    totalRebirths: 0,
    totalPlayTime: 0,
    highestCash: 0,
    highestClickPower: 1,
    highestAutoClickers: 0,
  });

  // Skill modifiers
  const [skillModifiers, setSkillModifiers] = useState({
    clickPowerBonus: 0,
    autoClickerBonus: 0,
    conversionRateBonus: 0,
    luckyCrateDiscount: 0,
    skillPointGain: 0,
  });

  // Skill tree initialization
  const createInitialSkills = (): Skill[] => [
    // Click Path
    { id: 'click_power_1', name: 'Power Click I', description: '+5% click power', cost: 1, maxLevel: 5, currentLevel: 0, category: 'click', effect: (level) => setSkillModifiers(prev => ({ ...prev, clickPowerBonus: prev.clickPowerBonus + 0.05 })) },
    { id: 'click_power_2', name: 'Power Click II', description: '+10% click power', cost: 2, maxLevel: 5, currentLevel: 0, prerequisite: 'click_power_1', category: 'click', effect: (level) => setSkillModifiers(prev => ({ ...prev, clickPowerBonus: prev.clickPowerBonus + 0.10 })) },
    { id: 'click_critical', name: 'Critical Clicks', description: '+20% click power', cost: 3, maxLevel: 3, currentLevel: 0, prerequisite: 'click_power_2', category: 'click', effect: (level) => setSkillModifiers(prev => ({ ...prev, clickPowerBonus: prev.clickPowerBonus + 0.20 })) },
    
    // Idle Path
    { id: 'idle_boost_1', name: 'Idle Boost I', description: '+5% auto clicker efficiency', cost: 1, maxLevel: 5, currentLevel: 0, category: 'idle', effect: (level) => setSkillModifiers(prev => ({ ...prev, autoClickerBonus: prev.autoClickerBonus + 0.05 })) },
    { id: 'idle_boost_2', name: 'Idle Boost II', description: '+10% auto clicker efficiency', cost: 2, maxLevel: 5, currentLevel: 0, prerequisite: 'idle_boost_1', category: 'idle', effect: (level) => setSkillModifiers(prev => ({ ...prev, autoClickerBonus: prev.autoClickerBonus + 0.10 })) },
    { id: 'idle_master', name: 'Idle Master', description: '+25% auto clicker efficiency', cost: 3, maxLevel: 3, currentLevel: 0, prerequisite: 'idle_boost_2', category: 'idle', effect: (level) => setSkillModifiers(prev => ({ ...prev, autoClickerBonus: prev.autoClickerBonus + 0.25 })) },
    
    // Economy Path
    { id: 'economy_1', name: 'Better Deals I', description: '+2% conversion rate', cost: 1, maxLevel: 5, currentLevel: 0, category: 'economy', effect: (level) => setSkillModifiers(prev => ({ ...prev, conversionRateBonus: prev.conversionRateBonus + 0.02 })) },
    { id: 'economy_2', name: 'Better Deals II', description: '+5% conversion rate', cost: 2, maxLevel: 5, currentLevel: 0, prerequisite: 'economy_1', category: 'economy', effect: (level) => setSkillModifiers(prev => ({ ...prev, conversionRateBonus: prev.conversionRateBonus + 0.05 })) },
    { id: 'lucky_discount', name: 'Lucky Bargain', description: '-10% lucky crate cost', cost: 2, maxLevel: 5, currentLevel: 0, prerequisite: 'economy_1', category: 'economy', effect: (level) => setSkillModifiers(prev => ({ ...prev, luckyCrateDiscount: prev.luckyCrateDiscount + 0.10 })) },
  ];

  const [skills, setSkills] = useState<Skill[]>(createInitialSkills());

  // Achievements initialization
  const createInitialAchievements = (): Achievement[] => [
    { id: 'first_click', name: 'First Click', description: 'Click 1 time', icon: '👆', unlocked: false, progress: 0, maxProgress: 1, reward: '+1 Skill Point', category: 'clicks' },
    { id: 'hundred_clicks', name: 'Century Clicker', description: 'Click 100 times', icon: '👏', unlocked: false, progress: 0, maxProgress: 100, reward: '+2 Skill Points', category: 'clicks' },
    { id: 'thousand_clicks', name: 'Click Master', description: 'Click 1,000 times', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1000, reward: '+5 Skill Points', category: 'clicks' },
    { id: 'million_clicks', name: 'Click God', description: 'Click 1,000,000 times', icon: '🔥', unlocked: false, progress: 0, maxProgress: 1000000, reward: '+10 Skill Points', category: 'clicks' },
    
    { id: 'first_cash', name: 'Getting Started', description: 'Earn $100 cash', icon: '💵', unlocked: false, progress: 0, maxProgress: 100, reward: '+1 Skill Point', category: 'cash' },
    { id: 'wealthy', name: 'Wealthy', description: 'Earn $10,000 cash', icon: '💰', unlocked: false, progress: 0, maxProgress: 10000, reward: '+3 Skill Points', category: 'cash' },
    { id: 'millionaire', name: 'Millionaire', description: 'Earn $1,000,000 cash', icon: '💎', unlocked: false, progress: 0, maxProgress: 1000000, reward: '+10 Skill Points', category: 'cash' },
    
    { id: 'first_upgrade', name: 'First Purchase', description: 'Buy 1 upgrade', icon: '🛒', unlocked: false, progress: 0, maxProgress: 1, reward: '+1 Skill Point', category: 'upgrades' },
    { id: 'upgrade_spree', name: 'Shopping Spree', description: 'Buy 50 upgrades', icon: '🛍️', unlocked: false, progress: 0, maxProgress: 50, reward: '+5 Skill Points', category: 'upgrades' },
    { id: 'upgrade_master', name: 'Master Collector', description: 'Buy 200 upgrades', icon: '📦', unlocked: false, progress: 0, maxProgress: 200, reward: '+10 Skill Points', category: 'upgrades' },
    
    { id: 'first_rebirth', name: 'Born Again', description: 'Complete 1 rebirth', icon: '🔄', unlocked: false, progress: 0, maxProgress: 1, reward: '+5 Skill Points', category: 'special' },
    { id: 'lucky_first', name: 'Lucky Try', description: 'Open 1 lucky crate', icon: '🎁', unlocked: false, progress: 0, maxProgress: 1, reward: '+2 Skill Points', category: 'special' },
    { id: 'lucky_addict', name: 'Gambling Problem', description: 'Open 100 lucky crates', icon: '🎰', unlocked: false, progress: 0, maxProgress: 100, reward: '+10 Skill Points', category: 'special' },
  ];

  const [achievements, setAchievements] = useState<Achievement[]>(createInitialAchievements());

  const initialUpgrades = [
    { id: 'power', name: 'Increase Click Power', baseCost: 15, cost: 15, effect: () => setClickPower(prev => prev + 1), count: 0, description: 'Increases the number of clicks you get per click.' },
    { id: 'power_2', name: 'Enhanced Cursor', baseCost: 75, cost: 75, effect: () => setClickPower(prev => prev + 3), count: 0, description: 'A more efficient clicking tool.' },
    { id: 'auto', name: 'Buy Auto Clicker', baseCost: 150, cost: 150, effect: () => setAutoClickers(prev => prev + 1), count: 0, description: 'Automatically clicks for you every second.' },
    { id: 'auto_2', name: 'Helper Bot', baseCost: 500, cost: 500, effect: () => setAutoClickers(prev => prev + 5), count: 0, description: 'A small bot that helps click faster.' },
    { id: 'grandma', name: 'Grandma', baseCost: 2000, cost: 2000, effect: () => setAutoClickers(prev => prev + 10), count: 0, description: 'A nice grandma who bakes cookies for you.' },
    { id: 'farm', name: 'Farm', baseCost: 15000, cost: 15000, effect: () => setAutoClickers(prev => prev + 50), count: 0, description: 'A farm to grow more cookies.' },
    { id: 'factory', name: 'Small Factory', baseCost: 75000, cost: 75000, effect: () => setAutoClickers(prev => prev + 200), count: 0, description: 'A small factory to produce cookies.' },
    { id: 'mine', name: 'Mine', baseCost: 250000, cost: 250000, effect: () => setAutoClickers(prev => prev + 500), count: 0, description: 'A mine to extract valuable cookie ore.' },
    { id: 'big_factory', name: 'Big Factory', baseCost: 1000000, cost: 1000000, effect: () => setAutoClickers(prev => prev + 2000), count: 0, description: 'A large factory to mass produce cookies.' },
    { id: 'lab', name: 'Laboratory', baseCost: 5000000, cost: 5000000, effect: () => setAutoClickers(prev => prev + 10000), count: 0, description: 'A lab that researches new cookie technology.' },
    { id: 'bank', name: 'Bank', baseCost: 20000000, cost: 20000000, effect: () => setAutoClickers(prev => prev + 50000), count: 0, description: 'A bank to store and generate interest on your cookies.' },
    { id: 'temple', name: 'Temple', baseCost: 100000000, cost: 100000000, effect: () => setAutoClickers(prev => prev + 250000), count: 0, description: 'A temple to worship the cookie gods.' },
    { id: 'portal', name: 'Portal', baseCost: 500000000, cost: 500000000, effect: () => setAutoClickers(prev => prev + 1000000), count: 0, description: 'A portal to another dimension full of cookies.' },
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
      skillPoints,
      upgrades,
      skills,
      achievements,
      statistics,
      skillModifiers,
      settings: {
        soundEnabled,
        theme,
        autoSaveEnabled,
      },
    };
    localStorage.setItem('cookieClickerGame', JSON.stringify(gameState));
    setNotification({ message: 'Game Saved!', type: 'success' });
  }, [clicks, cash, clickPower, autoClickers, luckyCrateCost, rebirths, prestigeCurrency, skillPoints, upgrades, skills, achievements, statistics, skillModifiers, soundEnabled, theme, autoSaveEnabled]);

  const loadGame = useCallback(() => {
    const savedState = localStorage.getItem('cookieClickerGame');
    if (savedState) {
      const gameState = JSON.parse(savedState);
      setClicks(gameState.clicks || 0);
      setCash(gameState.cash || 0);
      setClickPower(gameState.clickPower || 1);
      setAutoClickers(gameState.autoClickers || 0);
      setLuckyCrateCost(gameState.luckyCrateCost || 100);
      setRebirths(gameState.rebirths || 0);
      setPrestigeCurrency(gameState.prestigeCurrency || 0);
      setSkillPoints(gameState.skillPoints || 0);
      
      // Load settings if they exist
      if (gameState.settings) {
        setSoundEnabled(gameState.settings.soundEnabled ?? true);
        setTheme(gameState.settings.theme ?? 'dark');
        setAutoSaveEnabled(gameState.settings.autoSaveEnabled ?? true);
      }
      
      // Load statistics if they exist
      if (gameState.statistics) {
        setStatistics(gameState.statistics);
      }

      // Load skill modifiers if they exist
      if (gameState.skillModifiers) {
        setSkillModifiers(gameState.skillModifiers);
      }

      // Load skills with effect functions
      if (gameState.skills) {
        const loadedSkills = gameState.skills.map((loadedSkill: any) => {
          const initialSkill = createInitialSkills().find(s => s.id === loadedSkill.id);
          return initialSkill ? { ...loadedSkill, effect: initialSkill.effect } : loadedSkill;
        });
        setSkills(loadedSkills);
      }

      // Load achievements
      if (gameState.achievements) {
        setAchievements(gameState.achievements);
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

  // Helper function to check and unlock achievements
  const checkAchievements = useCallback(() => {
    setAchievements(prevAchievements => {
      const updated = prevAchievements.map(achievement => {
        if (achievement.unlocked) return achievement;

        let currentProgress = achievement.progress;
        
        // Update progress based on achievement type
        switch (achievement.id) {
          case 'first_click':
          case 'hundred_clicks':
          case 'thousand_clicks':
          case 'million_clicks':
            currentProgress = statistics.totalClicks;
            break;
          case 'first_cash':
          case 'wealthy':
          case 'millionaire':
            currentProgress = statistics.totalCashEarned;
            break;
          case 'first_upgrade':
          case 'upgrade_spree':
          case 'upgrade_master':
            currentProgress = statistics.totalUpgradesPurchased;
            break;
          case 'first_rebirth':
            currentProgress = statistics.totalRebirths;
            break;
          case 'lucky_first':
          case 'lucky_addict':
            currentProgress = statistics.totalLuckyCratesOpened;
            break;
        }

        const newAchievement = { ...achievement, progress: currentProgress };
        
        // Check if achievement should be unlocked
        if (currentProgress >= achievement.maxProgress && !achievement.unlocked) {
          newAchievement.unlocked = true;
          // Award skill points based on achievement reward
          const pointsMatch = achievement.reward.match(/\+(\d+) Skill Point/);
          if (pointsMatch) {
            const points = parseInt(pointsMatch[1]);
            setSkillPoints(prev => prev + points);
            setNotification({ 
              message: `🏆 Achievement Unlocked: ${achievement.name}! (+${points} Skill Points)`, 
              type: 'success' 
            });
          }
        }
        
        return newAchievement;
      });
      return updated;
    });
  }, [statistics]);

  // Check achievements whenever statistics change
  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  // Update statistics whenever relevant values change
  useEffect(() => {
    setStatistics(prev => ({
      ...prev,
      highestCash: Math.max(prev.highestCash, cash),
      highestClickPower: Math.max(prev.highestClickPower, clickPower),
      highestAutoClickers: Math.max(prev.highestAutoClickers, autoClickers),
    }));
  }, [cash, clickPower, autoClickers]);

  // Track play time
  useEffect(() => {
    const interval = setInterval(() => {
      setStatistics(prev => ({ ...prev, totalPlayTime: prev.totalPlayTime + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Skill unlock handler
  const handleUnlockSkill = useCallback((skillId: string) => {
    setSkills(prevSkills => {
      const updatedSkills = prevSkills.map(skill => {
        if (skill.id === skillId) {
          if (skillPoints >= skill.cost && skill.currentLevel < skill.maxLevel) {
            const canUnlock = !skill.prerequisite || 
              (prevSkills.find(s => s.id === skill.prerequisite)?.currentLevel ?? 0) > 0;
            
            if (canUnlock) {
              setSkillPoints(prev => prev - skill.cost);
              skill.effect(skill.currentLevel + 1);
              setNotification({ message: `Unlocked ${skill.name}!`, type: 'success' });
              return { ...skill, currentLevel: skill.currentLevel + 1 };
            } else {
              setNotification({ message: 'Prerequisite skill required!', type: 'error' });
            }
          } else if (skillPoints < skill.cost) {
            setNotification({ message: 'Not enough skill points!', type: 'error' });
          } else {
            setNotification({ message: 'Skill already maxed!', type: 'info' });
          }
        }
        return skill;
      });
      return updatedSkills;
    });
  }, [skillPoints]);

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
    // Update rebirth statistics
    setStatistics(prev => ({ ...prev, totalRebirths: prev.totalRebirths + 1 }));
    
    setRebirths(prev => prev + 1);
    const prestigeGained = Math.floor(cash / 1000000); // 1 prestige currency per 1,000,000 cash
    setPrestigeCurrency(prev => prev + prestigeGained);
    
    // Grant skill points on rebirth (1 per rebirth)
    setSkillPoints(prev => prev + 1);
    
    setClicks(0);
    setCash(0);
    setClickPower(1);
    setAutoClickers(0);
    setLuckyCrateCost(100);
    setUpgrades(initialUpgrades); // Reset upgrades
    
    setNotification({ 
      message: `Rebirth successful! +${prestigeGained} Prestige, +1 Skill Point!`, 
      type: 'success' 
    });
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
    setSkillPoints(0);
    setUpgrades(initialUpgrades);
    setSkills(createInitialSkills());
    setAchievements(createInitialAchievements());
    setStatistics({
      totalClicks: 0,
      totalCashEarned: 0,
      totalUpgradesPurchased: 0,
      totalLuckyCratesOpened: 0,
      totalRebirths: 0,
      totalPlayTime: 0,
      highestCash: 0,
      highestClickPower: 1,
      highestAutoClickers: 0,
    });
    setSkillModifiers({
      clickPowerBonus: 0,
      autoClickerBonus: 0,
      conversionRateBonus: 0,
      luckyCrateDiscount: 0,
      skillPointGain: 0,
    });
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
          message: 'Are you sure you want to Rebirth? You will lose all clicks, cash, and upgrades, but gain prestige currency and skill points!',
          onConfirm: handleRebirth,
          onCancel: () => setPopup(null),
        })}
        onOpenSettings={handleOpenSettings}
        onOpenSkillTree={() => setShowSkillTreeModal(true)}
        onOpenStatistics={() => setShowStatisticsModal(true)}
        onOpenAchievements={() => setShowAchievementsModal(true)}
        clicks={clicks}
        cash={cash}
        rebirths={rebirths}
        prestigeCurrency={prestigeCurrency}
        skillPoints={skillPoints}
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
        skillModifiers={skillModifiers}
        onStatUpdate={(statName, value) => {
          setStatistics(prev => ({
            ...prev,
            [statName]: prev[statName] + value
          }));
        }}
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

      <SkillTreeModal
        isOpen={showSkillTreeModal}
        onClose={() => setShowSkillTreeModal(false)}
        skillPoints={skillPoints}
        skills={skills}
        onUnlockSkill={handleUnlockSkill}
      />

      <StatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        statistics={statistics}
      />

      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={achievements}
      />
    </div>
  );
}

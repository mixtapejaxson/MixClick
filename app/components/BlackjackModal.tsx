import React, { useState, useEffect } from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { abbreviateNumber } from '../utils/numberFormatter';

interface BlackjackModalProps {
  isOpen: boolean;
  onClose: () => void;
  cash: number;
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
}

interface Card {
  suit: string;
  value: string;
  numValue: number;
}

const BlackjackModal: React.FC<BlackjackModalProps> = ({
  isOpen,
  onClose,
  cash,
  onWin,
  onLose,
}) => {
  const isMobile = useMobileDetection();
  const [bet, setBet] = useState(100);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [message, setMessage] = useState('Place your bet and start the game!');
  const [deck, setDeck] = useState<Card[]>([]);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        let numValue = parseInt(value);
        if (value === 'A') numValue = 11;
        else if (['J', 'Q', 'K'].includes(value)) numValue = 10;
        newDeck.push({ suit, value, numValue });
      });
    });
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((sum, card) => sum + card.numValue, 0);
    let aces = hand.filter(card => card.value === 'A').length;
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const startGame = () => {
    if (bet > cash) {
      setMessage('Not enough cash for this bet!');
      return;
    }
    if (bet < 10) {
      setMessage('Minimum bet is $10!');
      return;
    }

    const newDeck = createDeck();
    
    // Validate deck has enough cards
    if (newDeck.length < 4) {
      setMessage('Error: Not enough cards in deck!');
      return;
    }
    
    const newPlayerHand = [newDeck.pop()!, newDeck.pop()!];
    const newDealerHand = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState('playing');
    setMessage('Hit or Stand?');

    // Check for blackjack
    if (calculateHandValue(newPlayerHand) === 21) {
      endGame(newPlayerHand, newDealerHand, newDeck);
    }
  };

  const hit = () => {
    if (gameState !== 'playing') return;
    
    const newDeck = [...deck];
    
    // Validate deck has cards
    if (newDeck.length === 0) {
      setMessage('No more cards in deck!');
      stand();
      return;
    }
    
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...playerHand, newCard];
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);

    const handValue = calculateHandValue(newPlayerHand);
    if (handValue > 21) {
      setMessage(`Bust! You lose $${abbreviateNumber(bet)}`);
      onLose(bet);
      setGameState('gameOver');
    } else if (handValue === 21) {
      stand();
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;
    setGameState('dealerTurn');
    setMessage('Dealer is playing...');
    
    setTimeout(() => {
      dealerPlay();
    }, 500);
  };

  const dealerPlay = () => {
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];
    
    while (calculateHandValue(newDealerHand) < 17 && newDeck.length > 0) {
      const newCard = newDeck.pop()!;
      newDealerHand.push(newCard);
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);
    endGame(playerHand, newDealerHand, newDeck);
  };

  const endGame = (finalPlayerHand: Card[], finalDealerHand: Card[], remainingDeck: Card[]) => {
    const playerValue = calculateHandValue(finalPlayerHand);
    const dealerValue = calculateHandValue(finalDealerHand);

    setGameState('gameOver');
    
    if (playerValue > 21) {
      setMessage(`Bust! You lose $${abbreviateNumber(bet)}`);
      onLose(bet);
    } else if (dealerValue > 21) {
      setMessage(`Dealer busts! You win $${abbreviateNumber(bet)}`);
      onWin(bet);
    } else if (playerValue > dealerValue) {
      setMessage(`You win $${abbreviateNumber(bet)}!`);
      onWin(bet);
    } else if (playerValue < dealerValue) {
      setMessage(`Dealer wins! You lose $${abbreviateNumber(bet)}`);
      onLose(bet);
    } else {
      setMessage('Push! Bet returned.');
    }
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setMessage('Place your bet and start the game!');
    setDeck([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br from-green-800 via-green-700 to-emerald-900 text-white ${
        isMobile 
          ? 'p-5 mx-2 max-w-sm' 
          : 'p-8 max-w-3xl'
      } w-full rounded-3xl shadow-2xl border-4 border-yellow-500/30 relative overflow-hidden`}>
        
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        </div>
        
        {/* Header */}
        <div className="relative flex justify-between items-center mb-6 pb-4 border-b-2 border-yellow-500/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
              <span className="text-2xl">🃏</span>
            </div>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black text-yellow-300 drop-shadow-lg`}>
              ♠ Blackjack ♥
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-all text-white text-2xl font-bold shadow-lg`}
          >
            ×
          </button>
        </div>

        {/* Game Info */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-900/40 to-amber-900/40 rounded-2xl border-2 border-yellow-500/40">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-xs text-yellow-300">Your Balance</p>
              <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-yellow-100`}>
                ${abbreviateNumber(cash)}
              </p>
            </div>
          </div>
        </div>

        {/* Dealer Hand */}
        <div className="relative mb-6 p-4 bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl border-2 border-green-600/40">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎩</span>
            <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white`}>
              Dealer {gameState !== 'betting' && (
                <span className="ml-2 px-3 py-1 bg-yellow-500/30 rounded-full text-sm">
                  {gameState === 'playing' ? '?' : calculateHandValue(dealerHand)}
                </span>
              )}
            </h3>
          </div>
          <div className="flex gap-3 justify-center min-h-24">
            {dealerHand.map((card, index) => (
              <div
                key={index}
                className={`${isMobile ? 'w-14 h-20 text-xl' : 'w-20 h-28 text-3xl'} bg-gradient-to-br from-white to-gray-100 text-gray-900 rounded-xl shadow-2xl flex flex-col items-center justify-center font-black border-4 border-gray-200 transform transition-all hover:scale-105 ${
                  index === 1 && gameState === 'playing' ? 'from-blue-600 to-blue-700 border-blue-800' : ''
                }`}
              >
                {index === 1 && gameState === 'playing' ? (
                  <span className="text-white text-4xl">🂠</span>
                ) : (
                  <>
                    <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}>
                      {card.value}
                    </span>
                    <span className={`text-2xl ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}`}>
                      {card.suit}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Player Hand */}
        <div className="relative mb-6 p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-2xl border-2 border-blue-500/40">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👤</span>
            <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-white`}>
              You {gameState !== 'betting' && (
                <span className="ml-2 px-3 py-1 bg-blue-500/30 rounded-full text-sm">
                  {calculateHandValue(playerHand)}
                </span>
              )}
            </h3>
          </div>
          <div className="flex gap-3 justify-center min-h-24">
            {playerHand.map((card, index) => (
              <div
                key={index}
                className={`${isMobile ? 'w-14 h-20 text-xl' : 'w-20 h-28 text-3xl'} bg-gradient-to-br from-white to-gray-100 text-gray-900 rounded-xl shadow-2xl flex flex-col items-center justify-center font-black border-4 border-gray-200 transform transition-all hover:scale-105`}
              >
                <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}>
                  {card.value}
                </span>
                <span className={`text-2xl ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}`}>
                  {card.suit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className={`${isMobile ? 'text-sm mb-5 p-3' : 'text-xl mb-6 p-4'} text-center font-black bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border-2 border-yellow-500/40`}>
          <span className="text-yellow-100 drop-shadow-lg">{message}</span>
        </div>

        {/* Betting Controls */}
        {gameState === 'betting' && (
          <div className="relative space-y-4 mb-6">
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border-2 border-yellow-500/30">
              <label className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-yellow-300`}>Place Your Bet:</label>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(10, parseInt(e.target.value, 10) || 10))}
                className={`${isMobile ? 'w-28 px-3 py-2 text-base' : 'w-36 px-4 py-3 text-lg'} bg-white text-gray-900 rounded-xl border-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold shadow-inner`}
                min="10"
                step="10"
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setBet(Math.min(bet + 50, cash))}
                className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl`}
              >
                +$50
              </button>
              <button
                onClick={() => setBet(Math.min(bet + 100, cash))}
                className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl`}
              >
                +$100
              </button>
              <button
                onClick={() => setBet(Math.max(10, bet - 50))}
                className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'} bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl`}
              >
                -$50
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="relative flex gap-4 justify-center mb-6">
          {gameState === 'betting' && (
            <button
              onClick={startGame}
              disabled={bet > cash}
              className={`${isMobile ? 'px-8 py-4 text-base' : 'px-12 py-5 text-xl'} bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-black rounded-2xl hover:from-yellow-600 hover:to-amber-700 transition-all shadow-2xl hover:shadow-yellow-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0`}
            >
              🃏 Deal Cards
            </button>
          )}
          
          {gameState === 'playing' && (
            <>
              <button
                onClick={hit}
                className={`${isMobile ? 'px-6 py-3 text-base' : 'px-10 py-4 text-xl'} bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1 active:translate-y-0`}
              >
                👍 Hit
              </button>
              <button
                onClick={stand}
                className={`${isMobile ? 'px-6 py-3 text-base' : 'px-10 py-4 text-xl'} bg-gradient-to-r from-red-500 to-red-600 text-white font-black rounded-2xl hover:from-red-600 hover:to-red-700 transition-all shadow-2xl hover:shadow-red-500/50 transform hover:-translate-y-1 active:translate-y-0`}
              >
                🛑 Stand
              </button>
            </>
          )}

          {gameState === 'gameOver' && (
            <button
              onClick={resetGame}
              className={`${isMobile ? 'px-8 py-4 text-base' : 'px-12 py-5 text-xl'} bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 active:translate-y-0`}
            >
              🔄 New Game
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="relative text-center border-t-2 border-yellow-500/30 pt-4">
          <button
            onClick={onClose}
            className={`${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4 text-base'} bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg`}
          >
            🚪 Close Casino
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlackjackModal;

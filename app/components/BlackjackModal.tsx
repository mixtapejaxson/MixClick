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
    
    while (calculateHandValue(newDealerHand) < 17) {
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-gradient-to-br from-green-800 to-green-900 text-white ${
        isMobile 
          ? 'p-4 mx-4 max-w-sm' 
          : 'p-6 max-w-2xl'
      } w-full rounded-lg shadow-xl`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-3">
          <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-yellow-400`}>
            ♠ Blackjack ♥
          </h2>
          <button
            onClick={onClose}
            className={`${isMobile ? 'text-2xl p-1' : 'text-3xl p-2'} text-gray-400 hover:text-white transition-colors`}
          >
            ×
          </button>
        </div>

        {/* Game Info */}
        <div className={`${isMobile ? 'text-sm mb-3' : 'text-lg mb-4'} text-center`}>
          <p>Cash: <span className="font-semibold text-yellow-400">${abbreviateNumber(cash)}</span></p>
        </div>

        {/* Dealer Hand */}
        <div className="mb-4">
          <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold mb-2`}>
            Dealer {gameState !== 'betting' && `(${gameState === 'playing' ? '?' : calculateHandValue(dealerHand)})`}
          </h3>
          <div className="flex gap-2 justify-center min-h-20">
            {dealerHand.map((card, index) => (
              <div
                key={index}
                className={`${isMobile ? 'w-12 h-16 text-xl' : 'w-16 h-24 text-2xl'} bg-white text-gray-900 rounded shadow-lg flex flex-col items-center justify-center font-bold ${
                  index === 1 && gameState === 'playing' ? 'bg-gray-300' : ''
                }`}
              >
                {index === 1 && gameState === 'playing' ? '?' : (
                  <>
                    <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}>
                      {card.value}
                    </span>
                    <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}>
                      {card.suit}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Player Hand */}
        <div className="mb-4">
          <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold mb-2`}>
            You {gameState !== 'betting' && `(${calculateHandValue(playerHand)})`}
          </h3>
          <div className="flex gap-2 justify-center min-h-20">
            {playerHand.map((card, index) => (
              <div
                key={index}
                className={`${isMobile ? 'w-12 h-16 text-xl' : 'w-16 h-24 text-2xl'} bg-white text-gray-900 rounded shadow-lg flex flex-col items-center justify-center font-bold`}
              >
                <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}>
                  {card.value}
                </span>
                <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-900'}>
                  {card.suit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className={`${isMobile ? 'text-sm mb-4' : 'text-lg mb-6'} text-center font-semibold text-yellow-300`}>
          {message}
        </div>

        {/* Betting Controls */}
        {gameState === 'betting' && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-center gap-2">
              <label className={`${isMobile ? 'text-sm' : 'text-base'}`}>Bet:</label>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 10))}
                className={`${isMobile ? 'w-24 px-2 py-1 text-sm' : 'w-32 px-3 py-2'} bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-yellow-500`}
                min="10"
                step="10"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setBet(Math.min(bet + 50, cash))}
                className={`${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2'} bg-green-600 rounded hover:bg-green-700 transition-colors`}
              >
                +$50
              </button>
              <button
                onClick={() => setBet(Math.min(bet + 100, cash))}
                className={`${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2'} bg-green-600 rounded hover:bg-green-700 transition-colors`}
              >
                +$100
              </button>
              <button
                onClick={() => setBet(Math.max(10, bet - 50))}
                className={`${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2'} bg-red-600 rounded hover:bg-red-700 transition-colors`}
              >
                -$50
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {gameState === 'betting' && (
            <button
              onClick={startGame}
              disabled={bet > cash}
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-lg'} bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed`}
            >
              Deal
            </button>
          )}
          
          {gameState === 'playing' && (
            <>
              <button
                onClick={hit}
                className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-lg'} bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors`}
              >
                Hit
              </button>
              <button
                onClick={stand}
                className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-lg'} bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors`}
              >
                Stand
              </button>
            </>
          )}

          {gameState === 'gameOver' && (
            <button
              onClick={resetGame}
              className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-lg'} bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors`}
            >
              New Game
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors`}
          >
            Close Casino
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlackjackModal;

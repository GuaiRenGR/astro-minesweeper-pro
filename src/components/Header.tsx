import React from 'react';

interface HeaderProps {
  minesRemaining: number;
  elapsedTime: number;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  onReset: () => void;
}

export function Header({ minesRemaining, elapsedTime, gameStatus, onReset }: HeaderProps) {
  const getStatusEmoji = () => {
    switch (gameStatus) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      default:
        return '😊';
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(3, '0');
  };

  return (
    <div className="header">
      <div className="counter mines-counter">
        <span className="counter-icon">💣</span>
        <span className="counter-value">{formatNumber(Math.max(0, minesRemaining))}</span>
      </div>
      <button className="reset-button" onClick={onReset} aria-label="Reset game">
        {getStatusEmoji()}
      </button>
      <div className="counter timer-counter">
        <span className="counter-icon">⏱️</span>
        <span className="counter-value">{formatNumber(Math.min(999, elapsedTime))}</span>
      </div>
    </div>
  );
}

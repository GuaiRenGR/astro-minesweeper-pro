import React, { useState, useEffect } from 'react';
import { Board } from './Board';
import { Header } from './Header';
import { Controls } from './Controls';
import { Modal } from './Modal';
import { useGame } from '../hooks/useGame';
import type { Difficulty } from '../utils/gameLogic';
import '../styles/game.css';

interface BestScore {
  time: number;
  date: string;
}

type BestScores = Record<Difficulty, BestScore | null>;

export function Game() {
  const {
    gameState,
    elapsedTime,
    handleCellClick,
    handleCellRightClick,
    handleCellDoubleClick,
    resetGame,
    currentDifficulty,
  } = useGame('beginner');

  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [bestScores, setBestScores] = useState<BestScores>({
    beginner: null,
    intermediate: null,
    expert: null,
    custom: null,
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 加载最佳成绩
  useEffect(() => {
    const saved = localStorage.getItem('minesweeper-best-scores');
    if (saved) {
      setBestScores(JSON.parse(saved));
    }
  }, []);

  // 加载主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('minesweeper-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 应用主题
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('minesweeper-theme', theme);
  }, [theme]);

  // 检查游戏结束
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      // 保存最佳成绩
      const currentBest = bestScores[currentDifficulty];
      if (!currentBest || elapsedTime < currentBest.time) {
        const newBestScores = {
          ...bestScores,
          [currentDifficulty]: {
            time: elapsedTime,
            date: new Date().toLocaleDateString(),
          },
        };
        setBestScores(newBestScores);
        localStorage.setItem('minesweeper-best-scores', JSON.stringify(newBestScores));
      }
      setShowWinModal(true);
    } else if (gameState.gameStatus === 'lost') {
      setShowLoseModal(true);
    }
  }, [gameState.gameStatus]);

  const handleDifficultyChange = (difficulty: Difficulty, customConfig?: { rows: number; cols: number; mines: number }) => {
    resetGame(difficulty, customConfig);
    setShowWinModal(false);
    setShowLoseModal(false);
  };

  const handleReset = () => {
    resetGame();
    setShowWinModal(false);
    setShowLoseModal(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const minesRemaining = gameState.mines - gameState.flagsCount;
  const gameOver = gameState.gameStatus === 'won' || gameState.gameStatus === 'lost';

  return (
    <div className="game-container">
      <h1 className="game-title">💣 Minesweeper Pro</h1>

      <div className="game-wrapper">
        <Header
          minesRemaining={minesRemaining}
          elapsedTime={elapsedTime}
          gameStatus={gameState.gameStatus}
          onReset={handleReset}
        />

        <Board
          board={gameState.board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
          onCellDoubleClick={handleCellDoubleClick}
          gameOver={gameOver}
        />

        <Controls
          currentDifficulty={currentDifficulty}
          onDifficultyChange={handleDifficultyChange}
        />

        <div className="extra-controls">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 暗黑模式' : '☀️ 明亮模式'}
          </button>
        </div>
      </div>

      <div className="game-info">
        <p>左键点击揭开格子 | 右键标记地雷 | 双击快速揭开</p>
        {bestScores[currentDifficulty] && (
          <p className="best-score">
            最佳成绩: {bestScores[currentDifficulty]!.time}秒 ({bestScores[currentDifficulty]!.date})
          </p>
        )}
      </div>

      <Modal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        title="🎉 恭喜获胜!"
      >
        <div className="win-content">
          <p>用时: {elapsedTime} 秒</p>
          {bestScores[currentDifficulty]?.time === elapsedTime && (
            <p className="new-record">🏆 新纪录!</p>
          )}
          <button className="play-again-btn" onClick={handleReset}>
            再来一局
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showLoseModal}
        onClose={() => setShowLoseModal(false)}
        title="💥 游戏结束"
      >
        <div className="lose-content">
          <p>很遗憾，你踩到地雷了!</p>
          <button className="play-again-btn" onClick={handleReset}>
            再来一局
          </button>
        </div>
      </Modal>
    </div>
  );
}

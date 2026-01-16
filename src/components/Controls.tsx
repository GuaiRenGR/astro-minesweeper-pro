import React, { useState } from 'react';
import type { Difficulty } from '../utils/gameLogic';

interface ControlsProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty, customConfig?: { rows: number; cols: number; mines: number }) => void;
}

export function Controls({ currentDifficulty, onDifficultyChange }: ControlsProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customRows, setCustomRows] = useState(10);
  const [customCols, setCustomCols] = useState(10);
  const [customMines, setCustomMines] = useState(15);

  const handleCustomSubmit = () => {
    const maxMines = (customRows * customCols) - 9;
    const validMines = Math.min(customMines, maxMines);
    onDifficultyChange('custom', { rows: customRows, cols: customCols, mines: validMines });
    setShowCustom(false);
  };

  return (
    <div className="controls">
      <div className="difficulty-buttons">
        <button
          className={`difficulty-btn ${currentDifficulty === 'beginner' ? 'active' : ''}`}
          onClick={() => onDifficultyChange('beginner')}
        >
          初级
        </button>
        <button
          className={`difficulty-btn ${currentDifficulty === 'intermediate' ? 'active' : ''}`}
          onClick={() => onDifficultyChange('intermediate')}
        >
          中级
        </button>
        <button
          className={`difficulty-btn ${currentDifficulty === 'expert' ? 'active' : ''}`}
          onClick={() => onDifficultyChange('expert')}
        >
          高级
        </button>
        <button
          className={`difficulty-btn ${currentDifficulty === 'custom' ? 'active' : ''}`}
          onClick={() => setShowCustom(!showCustom)}
        >
          自定义
        </button>
      </div>

      {showCustom && (
        <div className="custom-settings">
          <div className="custom-input">
            <label>行数:</label>
            <input
              type="number"
              min="5"
              max="30"
              value={customRows}
              onChange={(e) => setCustomRows(Math.max(5, Math.min(30, parseInt(e.target.value) || 5)))}
            />
          </div>
          <div className="custom-input">
            <label>列数:</label>
            <input
              type="number"
              min="5"
              max="50"
              value={customCols}
              onChange={(e) => setCustomCols(Math.max(5, Math.min(50, parseInt(e.target.value) || 5)))}
            />
          </div>
          <div className="custom-input">
            <label>地雷:</label>
            <input
              type="number"
              min="1"
              max={(customRows * customCols) - 9}
              value={customMines}
              onChange={(e) => setCustomMines(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <button className="apply-btn" onClick={handleCustomSubmit}>
            应用
          </button>
        </div>
      )}
    </div>
  );
}

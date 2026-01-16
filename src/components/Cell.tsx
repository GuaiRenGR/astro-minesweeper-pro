import React, { memo } from 'react';
import type { Cell as CellType } from '../utils/gameLogic';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: () => void;
  onDoubleClick: () => void;
  gameOver: boolean;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

export const Cell = memo(function Cell({ cell, onClick, onRightClick, onDoubleClick, gameOver }: CellProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick();
  };

  const getCellContent = () => {
    if (cell.isFlagged) {
      return <span className="flag">🚩</span>;
    }
    if (!cell.isRevealed) {
      return null;
    }
    if (cell.isMine) {
      return <span className="mine">💣</span>;
    }
    if (cell.adjacentMines > 0) {
      return (
        <span className="number" style={{ color: NUMBER_COLORS[cell.adjacentMines] }}>
          {cell.adjacentMines}
        </span>
      );
    }
    return null;
  };

  const getCellClassName = () => {
    let className = 'cell';
    if (cell.isRevealed) {
      className += ' revealed';
      if (cell.isMine) {
        className += ' mine-cell';
      }
    } else {
      className += ' hidden';
    }
    if (cell.isFlagged) {
      className += ' flagged';
    }
    if (gameOver && cell.isFlagged && !cell.isMine) {
      className += ' wrong-flag';
    }
    return className;
  };

  return (
    <button
      className={getCellClassName()}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={onDoubleClick}
      disabled={gameOver && !cell.isRevealed}
      aria-label={`Cell ${cell.row}, ${cell.col}`}
    >
      {getCellContent()}
    </button>
  );
});

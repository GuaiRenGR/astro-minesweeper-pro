import React from 'react';
import { Cell } from './Cell';
import type { Cell as CellType } from '../utils/gameLogic';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellDoubleClick: (row: number, col: number) => void;
  gameOver: boolean;
}

export function Board({ board, onCellClick, onCellRightClick, onCellDoubleClick, gameOver }: BoardProps) {
  const cols = board[0]?.length || 0;

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
            onRightClick={() => onCellRightClick(rowIndex, colIndex)}
            onDoubleClick={() => onCellDoubleClick(rowIndex, colIndex)}
            gameOver={gameOver}
          />
        ))
      )}
    </div>
  );
}

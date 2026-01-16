import { useState, useCallback, useEffect, useRef } from 'react';
import {
  GameState,
  Difficulty,
  initGameState,
  placeMines,
  revealCell,
  toggleFlag,
  chordReveal,
  checkWin,
  checkLoss,
  revealAllMines,
  countFlags,
  countRevealed,
} from '../utils/gameLogic';

export interface UseGameReturn {
  gameState: GameState;
  elapsedTime: number;
  handleCellClick: (row: number, col: number) => void;
  handleCellRightClick: (row: number, col: number) => void;
  handleCellDoubleClick: (row: number, col: number) => void;
  resetGame: (difficulty?: Difficulty, customConfig?: { rows: number; cols: number; mines: number }) => void;
  currentDifficulty: Difficulty;
}

export function useGame(initialDifficulty: Difficulty = 'beginner'): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>(() => initGameState(initialDifficulty));
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(initialDifficulty);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 计时器
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.startTime) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - gameState.startTime!) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameStatus, gameState.startTime]);

  // 重置游戏
  const resetGame = useCallback((difficulty?: Difficulty, customConfig?: { rows: number; cols: number; mines: number }) => {
    const diff = difficulty || currentDifficulty;
    if (difficulty) {
      setCurrentDifficulty(difficulty);
    }
    setGameState(initGameState(diff, customConfig));
    setElapsedTime(0);
  }, [currentDifficulty]);

  // 左键点击
  const handleCellClick = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      if (prevState.gameStatus === 'won' || prevState.gameStatus === 'lost') {
        return prevState;
      }

      let newBoard = prevState.board;
      let newStatus = prevState.gameStatus;
      let startTime = prevState.startTime;
      let endTime = prevState.endTime;

      // 首次点击，放置地雷并开始计时
      if (prevState.gameStatus === 'idle') {
        newBoard = placeMines(prevState.board, prevState.mines, row, col);
        newStatus = 'playing';
        startTime = Date.now();
      }

      // 揭开格子
      newBoard = revealCell(newBoard, row, col);

      // 检查游戏状态
      if (checkLoss(newBoard)) {
        newBoard = revealAllMines(newBoard);
        newStatus = 'lost';
        endTime = Date.now();
      } else if (checkWin(newBoard)) {
        newStatus = 'won';
        endTime = Date.now();
      }

      return {
        ...prevState,
        board: newBoard,
        gameStatus: newStatus,
        startTime,
        endTime,
        flagsCount: countFlags(newBoard),
        revealedCount: countRevealed(newBoard),
      };
    });
  }, []);

  // 右键点击（标记旗帜）
  const handleCellRightClick = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      if (prevState.gameStatus === 'won' || prevState.gameStatus === 'lost' || prevState.gameStatus === 'idle') {
        return prevState;
      }

      const newBoard = toggleFlag(prevState.board, row, col);

      return {
        ...prevState,
        board: newBoard,
        flagsCount: countFlags(newBoard),
      };
    });
  }, []);

  // 双击（快速揭开）
  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      let newBoard = chordReveal(prevState.board, row, col);
      let newStatus = prevState.gameStatus;
      let endTime = prevState.endTime;

      // 检查游戏状态
      if (checkLoss(newBoard)) {
        newBoard = revealAllMines(newBoard);
        newStatus = 'lost';
        endTime = Date.now();
      } else if (checkWin(newBoard)) {
        newStatus = 'won';
        endTime = Date.now();
      }

      return {
        ...prevState,
        board: newBoard,
        gameStatus: newStatus,
        endTime,
        flagsCount: countFlags(newBoard),
        revealedCount: countRevealed(newBoard),
      };
    });
  }, []);

  return {
    gameState,
    elapsedTime,
    handleCellClick,
    handleCellRightClick,
    handleCellDoubleClick,
    resetGame,
    currentDifficulty,
  };
}

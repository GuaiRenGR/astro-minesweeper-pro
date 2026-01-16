// 游戏核心逻辑

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export interface GameState {
  board: Cell[][];
  rows: number;
  cols: number;
  mines: number;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  flagsCount: number;
  revealedCount: number;
  startTime: number | null;
  endTime: number | null;
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export const DIFFICULTY_CONFIG: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
  custom: { rows: 9, cols: 9, mines: 10 },
};

// 创建空白游戏板
export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      };
    }
  }
  return board;
}

// 获取相邻格子
export function getNeighbors(board: Cell[][], row: number, col: number): Cell[] {
  const neighbors: Cell[] = [];
  const rows = board.length;
  const cols = board[0].length;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        neighbors.push(board[newRow][newCol]);
      }
    }
  }
  return neighbors;
}

// 放置地雷（首次点击安全）
export function placeMines(
  board: Cell[][],
  mines: number,
  safeRow: number,
  safeCol: number
): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  // 获取安全区域（首次点击位置及周围8格）
  const safeZone = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr;
      const c = safeCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`);
      }
    }
  }

  // 随机放置地雷
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row},${col}`;

    if (!safeZone.has(key) && !newBoard[row][col].isMine) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // 计算每个格子周围的地雷数
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        const neighbors = getNeighbors(newBoard, row, col);
        newBoard[row][col].adjacentMines = neighbors.filter(n => n.isMine).length;
      }
    }
  }

  return newBoard;
}

// 揭开格子（使用BFS自动展开空白区域）
export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(r => r.map(cell => ({ ...cell })));
  const cell = newBoard[row][col];

  if (cell.isRevealed || cell.isFlagged) {
    return newBoard;
  }

  // 如果是地雷，直接揭开
  if (cell.isMine) {
    cell.isRevealed = true;
    return newBoard;
  }

  // BFS 展开
  const queue: [number, number][] = [[row, col]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const currentCell = newBoard[r][c];
    if (currentCell.isFlagged || currentCell.isMine) continue;

    currentCell.isRevealed = true;

    // 如果是空白格子，继续展开相邻格子
    if (currentCell.adjacentMines === 0) {
      const neighbors = getNeighbors(newBoard, r, c);
      for (const neighbor of neighbors) {
        if (!visited.has(`${neighbor.row},${neighbor.col}`)) {
          queue.push([neighbor.row, neighbor.col]);
        }
      }
    }
  }

  return newBoard;
}

// 快速揭开（双击功能）
export function chordReveal(board: Cell[][], row: number, col: number): Cell[][] {
  const cell = board[row][col];

  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return board;
  }

  const neighbors = getNeighbors(board, row, col);
  const flaggedCount = neighbors.filter(n => n.isFlagged).length;

  // 只有当旗帜数等于数字时才展开
  if (flaggedCount !== cell.adjacentMines) {
    return board;
  }

  let newBoard = board.map(r => r.map(c => ({ ...c })));

  for (const neighbor of neighbors) {
    if (!neighbor.isRevealed && !neighbor.isFlagged) {
      newBoard = revealCell(newBoard, neighbor.row, neighbor.col);
    }
  }

  return newBoard;
}

// 切换旗帜
export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(r => r.map(cell => ({ ...cell })));
  const cell = newBoard[row][col];

  if (cell.isRevealed) {
    return newBoard;
  }

  cell.isFlagged = !cell.isFlagged;
  return newBoard;
}

// 检查游戏是否胜利
export function checkWin(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      // 如果有非地雷格子未揭开，则未胜利
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

// 检查游戏是否失败
export function checkLoss(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell.isMine && cell.isRevealed) {
        return true;
      }
    }
  }
  return false;
}

// 揭开所有地雷（游戏结束时）
export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed,
    }))
  );
}

// 计算已揭开的格子数
export function countRevealed(board: Cell[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isRevealed) count++;
    }
  }
  return count;
}

// 计算旗帜数
export function countFlags(board: Cell[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) count++;
    }
  }
  return count;
}

// 初始化游戏状态
export function initGameState(difficulty: Difficulty, customConfig?: { rows: number; cols: number; mines: number }): GameState {
  const config = difficulty === 'custom' && customConfig ? customConfig : DIFFICULTY_CONFIG[difficulty];
  const { rows, cols, mines } = config;

  return {
    board: createEmptyBoard(rows, cols),
    rows,
    cols,
    mines,
    gameStatus: 'idle',
    flagsCount: 0,
    revealedCount: 0,
    startTime: null,
    endTime: null,
  };
}

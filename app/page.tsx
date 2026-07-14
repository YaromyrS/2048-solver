'use client';

import { useCallback, useState } from 'react';
import { AvoidToggle } from '@/components/AvoidToggle';
import { Board } from '@/components/Board';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DirectionArrow } from '@/components/DirectionArrow';
import { LandingDemo } from '@/components/LandingDemo';
import { MenuButton } from '@/components/MenuButton';
import { NumberSelector, type NewTileValue } from '@/components/NumberSelector';
import { RestartButton } from '@/components/RestartButton';
import { TilePalette, type PaletteValue } from '@/components/TilePalette';
import { UndoButton } from '@/components/UndoButton';
import {
  applyMove,
  countEmpty,
  emptyBoard,
  placeTile,
  setCell,
  SIZE,
  type Board as BoardType,
  type Position,
} from '@/lib/game/board';
import { computeBestMove } from '@/lib/solver/client';
import { type MoveSuggestion } from '@/lib/solver/expectimax';

type Phase = 'landing' | 'setup' | 'continue' | 'proposal' | 'gameover';

const SETUP_TILES = 2;
const CELL_COUNT = SIZE * SIZE;

const DIRECTION_WORD: Record<MoveSuggestion['direction'], string> = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

interface PendingConfirm {
  title: string;
  message: string;
  confirmLabel: string;
  action: () => void;
}

/** A proposal state we can return to via Undo. */
interface ProposalSnapshot {
  board: BoardType;
  suggestion: MoveSuggestion;
  afterBoard: BoardType;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [board, setBoard] = useState<BoardType>(emptyBoard);
  const [setupCount, setSetupCount] = useState(0);
  const [suggestion, setSuggestion] = useState<MoveSuggestion | null>(null);
  const [afterBoard, setAfterBoard] = useState<BoardType | null>(null);
  const [newTileValue, setNewTileValue] = useState<NewTileValue>(2);
  const [paletteValue, setPaletteValue] = useState<PaletteValue>(2);
  const [computing, setComputing] = useState(false);
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [history, setHistory] = useState<ProposalSnapshot[]>([]);
  // Strategy preference: this game ends at 2048, so by default the solver caps
  // play at 1024. Persists across restarts (it's a preference, not board state).
  const [avoid2048, setAvoid2048] = useState(true);

  const resetState = useCallback(() => {
    setBoard(emptyBoard());
    setSetupCount(0);
    setSuggestion(null);
    setAfterBoard(null);
    setNewTileValue(2);
    setPaletteValue(2);
    setComputing(false);
    setHistory([]);
  }, []);

  const startGame = useCallback(() => {
    resetState();
    setPhase('setup');
  }, [resetState]);

  const startContinue = useCallback(() => {
    resetState();
    setPhase('continue');
  }, [resetState]);

  const goToLanding = useCallback(() => {
    resetState();
    setPhase('landing');
  }, [resetState]);

  // Compute the best move for `target`, then show it — or end the game if the
  // board is terminal. The search runs in a Web Worker; the short yield keeps
  // the "Calculating…" state painting even on the sync (fallback) path.
  const solve = useCallback(async (target: BoardType, avoid: boolean) => {
    setComputing(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    const result = await computeBestMove(target, { avoid2048: avoid });
    setComputing(false);

    setBoard(target);
    if (!result) {
      setSuggestion(null);
      setAfterBoard(null);
      setPhase('gameover');
      return;
    }
    setSuggestion(result);
    setAfterBoard(applyMove(target, result.direction).board);
    setNewTileValue(2);
    setPhase('proposal');
  }, []);

  // Setup: every placed tile is a 2; once both are down, solve.
  const handleSetupClick = useCallback(
    (pos: Position) => {
      if (computing) return;
      const next = placeTile(board, pos.row, pos.col, 2);
      const count = setupCount + 1;
      setBoard(next);
      setSetupCount(count);
      if (count >= SETUP_TILES) void solve(next, avoid2048);
    },
    [board, computing, setupCount, solve, avoid2048],
  );

  // Proposal: the user places the tile their real game spawned directly onto the
  // after-board, then we re-solve — no separate "Next" step (one fewer click).
  // The current proposal is snapshotted first so it can be undone.
  const placeSpawnTile = useCallback(
    (pos: Position, value: NewTileValue) => {
      if (computing || !afterBoard || !suggestion) return;
      setHistory((h) => [...h, { board, suggestion, afterBoard }]);
      const next = placeTile(afterBoard, pos.row, pos.col, value);
      void solve(next, avoid2048);
    },
    [board, afterBoard, suggestion, computing, solve, avoid2048],
  );

  // Left-click drops the selected value; right-click drops the alternate (2↔4),
  // so the common case rarely needs the selector.
  const handleAddTileClick = useCallback(
    (pos: Position) => placeSpawnTile(pos, newTileValue),
    [placeSpawnTile, newTileValue],
  );
  const handleAddTileAltClick = useCallback(
    (pos: Position) => placeSpawnTile(pos, newTileValue === 2 ? 4 : 2),
    [placeSpawnTile, newTileValue],
  );

  // Undo: step back to the previous proposal so a mis-entered tile can be redone.
  const canUndo = history.length > 0 && (phase === 'proposal' || phase === 'gameover');
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setSuggestion(prev.suggestion);
    setAfterBoard(prev.afterBoard);
    setNewTileValue(2);
    setComputing(false);
    setPhase('proposal');
    setHistory((h) => h.slice(0, -1));
  }, [history]);

  // Continue editor: paint the selected value onto any cell (0 = erase).
  const handleContinueClick = useCallback(
    (pos: Position) => {
      if (computing) return;
      setBoard((prev) => setCell(prev, pos.row, pos.col, paletteValue));
    },
    [computing, paletteValue],
  );

  const handleContinueSolve = useCallback(() => {
    void solve(board, avoid2048);
  }, [board, solve, avoid2048]);

  // Flipping the strategy re-evaluates the current proposal right away so the
  // suggestion always matches the active setting.
  const handleToggleAvoid = useCallback(
    (value: boolean) => {
      setAvoid2048(value);
      if (phase === 'proposal') void solve(board, value);
    },
    [phase, board, solve],
  );

  // A "live" board is one with progress worth protecting from an accidental exit.
  const hasProgress =
    (phase === 'setup' && setupCount > 0) ||
    phase === 'proposal' ||
    (phase === 'continue' && countEmpty(board) < CELL_COUNT);

  // Guard a navigation away from a live board behind a confirm dialog.
  const guardLeave = useCallback(
    (action: () => void, confirmLabel: string) => {
      if (hasProgress) {
        setPending({
          title: 'Leave this game?',
          message: 'Your current board and progress will be lost.',
          confirmLabel,
          action,
        });
      } else {
        action();
      }
    },
    [hasProgress],
  );

  const handleRestart = useCallback(
    () => guardLeave(startGame, 'Restart'),
    [guardLeave, startGame],
  );
  const handleMenu = useCallback(() => guardLeave(goToLanding, 'Leave'), [guardLeave, goToLanding]);

  return (
    <main className="app">
      {phase !== 'landing' && (
        <header className="topbar">
          <span className="topbar__title">2048 Solver</span>
          <div className="topbar__actions">
            {canUndo && <UndoButton onClick={handleUndo} />}
            <MenuButton onClick={handleMenu} />
            <RestartButton onClick={handleRestart} />
          </div>
        </header>
      )}

      {phase !== 'landing' && (
        <div className="settings-bar">
          <AvoidToggle checked={avoid2048} onChange={handleToggleAvoid} />
        </div>
      )}

      {phase === 'landing' && (
        <div className="landing">
          <h1 className="landing__title">2048 Solver</h1>
          <p className="landing__subtitle">
            Tell it your board and it works out the best swipe — move after move.
          </p>
          <LandingDemo />
          <div className="landing__actions">
            <button type="button" className="btn btn--primary" onClick={startGame}>
              Start Solving
            </button>
            <button type="button" className="btn btn--ghost" onClick={startContinue}>
              Continue Game
            </button>
          </div>
          <div className="landing__toggle">
            <AvoidToggle checked={avoid2048} onChange={handleToggleAvoid} />
          </div>
          <p className="landing__hint">
            <strong>Avoid making 2048</strong> caps play at 1024, since this game ends the moment a
            2048 appears. Turn it off to play all-out for the highest tile.
            <br />
            Already mid-game? Use <strong>Continue Game</strong> to recreate your current board.
          </p>
        </div>
      )}

      {phase === 'setup' && (
        <div className="stage">
          <p className="instruction">
            Place your first two tiles (both are <strong>2</strong>) — tap two empty cells.
            <br />
            {setupCount}/{SETUP_TILES} placed.
          </p>
          <Board board={board} onCellClick={handleSetupClick} />
          <p className="status">{computing ? 'Calculating best move…' : ''}</p>
        </div>
      )}

      {phase === 'continue' && (
        <div className="stage">
          <p className="instruction">
            Recreate your current game: pick a value, then tap cells to fill in your board. Tap a
            filled cell to change it, or choose <strong>Erase</strong> to clear one.
          </p>
          <TilePalette value={paletteValue} onChange={setPaletteValue} />
          <Board board={board} onCellClick={handleContinueClick} allowOverwrite />
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleContinueSolve}
            disabled={computing || countEmpty(board) === CELL_COUNT}
          >
            Solve from here
          </button>
          <p className="status">{computing ? 'Calculating best move…' : ''}</p>
        </div>
      )}

      {phase === 'proposal' && suggestion && afterBoard && (
        <div className="stage">
          <p className="instruction">
            Best move: swipe <strong>{DIRECTION_WORD[suggestion.direction]}</strong>. Make that move,
            then tap the <strong>highlighted</strong> board where the new tile appeared.
          </p>
          <div className="comparison">
            <div className="comparison__side comparison__side--muted">
              <span className="comparison__caption">Now</span>
              <Board board={board} variant="small" />
            </div>
            <DirectionArrow direction={suggestion.direction} />
            <div className="comparison__side comparison__side--active">
              <span className="comparison__caption comparison__caption--active">
                Tap the new tile’s spot ↓
              </span>
              <Board
                board={afterBoard}
                variant="small"
                onCellClick={handleAddTileClick}
                onCellAltClick={handleAddTileAltClick}
              />
            </div>
          </div>
          <div className="addtile">
            <span className="addtile__label">New tile value</span>
            <NumberSelector value={newTileValue} onChange={setNewTileValue} />
          </div>
          {avoid2048 && afterBoard.some((row) => row.some((v) => v >= 2048)) && (
            <p className="hint hint--warn">
              No move avoids 2048 anymore — this one forms it and ends the game.
            </p>
          )}
          <p className="hint">
            Tap drops <strong>{newTileValue}</strong>; long-press (or right-click) drops{' '}
            <strong>{newTileValue === 2 ? 4 : 2}</strong>.
          </p>
          <p className="status">{computing ? 'Calculating best move…' : ''}</p>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="stage">
          <div className="gameover">
            <h2>You&apos;re out of moves</h2>
            <Board board={board} variant="small" />
            <button type="button" className="btn btn--primary" onClick={startGame}>
              Restart
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        Implemented by <strong>FlexDev</strong>
      </footer>

      {pending && (
        <ConfirmDialog
          title={pending.title}
          message={pending.message}
          confirmLabel={pending.confirmLabel}
          onConfirm={() => {
            pending.action();
            setPending(null);
          }}
          onCancel={() => setPending(null)}
        />
      )}
    </main>
  );
}

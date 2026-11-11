'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { Board } from '@/components/Board';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DirectionArrow } from '@/components/DirectionArrow';
import { useMessages } from '@/components/I18nProvider';
import { LandingDemo } from '@/components/LandingDemo';
import { LandingInfo } from '@/components/LandingInfo';
import { MenuButton } from '@/components/MenuButton';
import { NumberSelector, type NewTileValue } from '@/components/NumberSelector';
import { RestartButton } from '@/components/RestartButton';
import { Rich } from '@/components/Rich';
import { ScreenshotImport } from '@/components/ScreenshotImport';
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
import { format } from '@/lib/i18n/format';
import { computeBestMove, prepareSolver } from '@/lib/solver/client';
import { type MoveSuggestion } from '@/lib/solver/expectimax';
import { BUG_REPORT_URL, DONATE_URL, REPO_URL, SITE_NAME } from '@/lib/site';
import type { BoardReading } from '@/lib/vision/readBoard';

type Phase = 'landing' | 'setup' | 'continue' | 'proposal' | 'gameover';

const SETUP_TILES = 2;
const CELL_COUNT = SIZE * SIZE;
/** Screenshot tiles read with less confidence than this are outlined for a check. */
const UNSURE_READING = 0.1;

interface ImportNote {
  text: string;
  warn: boolean;
}

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

interface SolverAppProps {
  /**
   * Shown in the footer on the start screen only, so switching language never
   * throws away a board in progress.
   */
  languageSwitcher?: ReactNode;
}

export function SolverApp({ languageSwitcher }: SolverAppProps) {
  const t = useMessages();
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
  // Strategy preference: the largest tile the solver may form (null = no limit).
  // This game ends at 2048, so the default caps play at 1024. Persists across
  // restarts (it's a preference, not board state).
  const [maxTile, setMaxTile] = useState<number | null>(1024);
  // Result of the last screenshot import in the Continue editor.
  const [importNote, setImportNote] = useState<ImportNote | null>(null);
  const [flagged, setFlagged] = useState<boolean[][] | null>(null);

  const resetState = useCallback(() => {
    setBoard(emptyBoard());
    setSetupCount(0);
    setSuggestion(null);
    setAfterBoard(null);
    setNewTileValue(2);
    setPaletteValue(2);
    setComputing(false);
    setHistory([]);
    setImportNote(null);
    setFlagged(null);
  }, []);

  const startGame = useCallback(() => {
    prepareSolver();
    resetState();
    setPhase('setup');
  }, [resetState]);

  const startContinue = useCallback(() => {
    prepareSolver();
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
  const solve = useCallback(async (target: BoardType, cap: number | null) => {
    setComputing(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    const result = await computeBestMove(target, { maxTile: cap });
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
      if (count >= SETUP_TILES) void solve(next, maxTile);
    },
    [board, computing, setupCount, solve, maxTile],
  );

  // Proposal: the user places the tile their real game spawned directly onto the
  // after-board, then we re-solve — no separate "Next" step (one fewer click).
  // The current proposal is snapshotted first so it can be undone.
  const placeSpawnTile = useCallback(
    (pos: Position, value: NewTileValue) => {
      if (computing || !afterBoard || !suggestion) return;
      setHistory((h) => [...h, { board, suggestion, afterBoard }]);
      const next = placeTile(afterBoard, pos.row, pos.col, value);
      void solve(next, maxTile);
    },
    [board, afterBoard, suggestion, computing, solve, maxTile],
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
  // Editing a cell counts as checking it, so its outline goes away.
  const handleContinueClick = useCallback(
    (pos: Position) => {
      if (computing) return;
      setBoard((prev) => setCell(prev, pos.row, pos.col, paletteValue));
      setFlagged((prev) => prev && prev.map((row, r) => row.map((f, c) => f && !(r === pos.row && c === pos.col))));
    },
    [computing, paletteValue],
  );

  // A screenshot fills the editor; the user checks it before solving.
  const handleScreenshotRead = useCallback(
    (reading: BoardReading) => {
      const unsure = reading.confidence.map((row, r) =>
        row.map((c, col) => reading.board[r][col] !== 0 && c < UNSURE_READING),
      );
      const unsureCount = unsure.flat().filter(Boolean).length;
      const tileCount = reading.board.flat().filter((v) => v !== 0).length;
      // A game that already shows a tile above the cap evidently doesn't end
      // there, so the cap would only make the solver misjudge it.
      const top = Math.max(...reading.board.flat());
      const liftCap = maxTile !== null && top > maxTile;
      if (liftCap) setMaxTile(null);
      const capNote = liftCap ? ` ${format(t.importShot.capLifted, { top })}` : '';
      setBoard(reading.board);
      setFlagged(unsureCount > 0 ? unsure : null);
      setImportNote(
        unsureCount > 0
          ? {
              warn: true,
              text:
                format(t.importShot.readUnsure, { tiles: tileCount, unsure: unsureCount }) + capNote,
            }
          : { warn: false, text: format(t.importShot.readOk, { tiles: tileCount }) + capNote },
      );
    },
    [maxTile, t],
  );

  const handleScreenshotError = useCallback((message: string) => {
    setImportNote({ warn: true, text: message });
  }, []);

  const handleContinueSolve = useCallback(() => {
    void solve(board, maxTile);
  }, [board, solve, maxTile]);

  // Changing the cap re-evaluates the current proposal right away so the
  // suggestion always matches the active setting.
  const handleMaxTileChange = useCallback(
    (value: number | null) => {
      setMaxTile(value);
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
          title: t.leave.title,
          message: t.leave.message,
          confirmLabel,
          action,
        });
      } else {
        action();
      }
    },
    [hasProgress, t],
  );

  const handleRestart = useCallback(
    () => guardLeave(startGame, t.leave.restart),
    [guardLeave, startGame, t],
  );
  const handleMenu = useCallback(
    () => guardLeave(goToLanding, t.leave.leave),
    [guardLeave, goToLanding, t],
  );

  // Read out by screen readers whenever it changes (the visible text is not a live region).
  const announcement = computing
    ? t.status.calculating
    : phase === 'proposal' && suggestion
      ? format(t.status.bestMove, { direction: t.directions[suggestion.direction] })
      : phase === 'gameover'
        ? t.status.outOfMoves
        : '';

  return (
    <main className="app">
      <p className="sr-only" role="status">
        {announcement}
      </p>

      {phase !== 'landing' && (
        <header className="topbar">
          <h1 className="topbar__heading">
            <button
              type="button"
              className="topbar__title"
              onClick={handleMenu}
              title={t.topbar.homeTitle}
            >
              {SITE_NAME}
            </button>
          </h1>
          <div className="topbar__actions">
            {canUndo && <UndoButton onClick={handleUndo} />}
            <MenuButton onClick={handleMenu} />
            <RestartButton onClick={handleRestart} />
          </div>
        </header>
      )}

      {phase !== 'landing' && (
        <div className="settings-bar">
          <AdvancedSettings maxTile={maxTile} onMaxTileChange={handleMaxTileChange} popover />
        </div>
      )}

      {phase === 'landing' && (
        <div className="landing">
          <h1 className="landing__title">{SITE_NAME}</h1>
          <p className="landing__subtitle">{t.tagline}</p>
          <LandingDemo />
          <div className="landing__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={startGame}
              title={t.landing.startTitle}
            >
              {t.landing.start}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={startContinue}
              title={t.landing.continueTitle}
            >
              {t.landing.continue}
            </button>
          </div>
          <div className="landing__settings">
            <AdvancedSettings maxTile={maxTile} onMaxTileChange={handleMaxTileChange} />
          </div>
          <p className="landing__hint">
            <Rich text={t.landing.hintLimit} />
            <br />
            <Rich text={t.landing.hintContinue} />
          </p>
          <LandingInfo />
        </div>
      )}

      {phase === 'setup' && (
        <div className="stage">
          <p className="instruction instruction--lead">
            <Rich text={t.setup.lead} />
            <br />
            {format(t.setup.progress, { count: setupCount, total: SETUP_TILES })}
          </p>
          <Board
            board={board}
            onCellClick={handleSetupClick}
            label={t.board.yourBoard}
            cellHint={t.setup.cellHint}
          />
          <p className="status">{computing ? t.status.calculating : ''}</p>
        </div>
      )}

      {phase === 'continue' && (
        <div className="stage">
          <p className="instruction">
            <Rich text={t.continueGame.instruction} />
          </p>
          <ScreenshotImport
            onRead={handleScreenshotRead}
            onError={handleScreenshotError}
            disabled={computing}
          />
          {importNote && (
            <p className={`import-note${importNote.warn ? ' import-note--warn' : ''}`} role="status">
              {importNote.text}
            </p>
          )}
          <TilePalette value={paletteValue} onChange={setPaletteValue} />
          <Board
            board={board}
            onCellClick={handleContinueClick}
            allowOverwrite
            flagged={flagged ?? undefined}
            label={t.board.yourBoard}
            cellHint={
              paletteValue === 0
                ? t.continueGame.clearCell
                : format(t.continueGame.placeValue, { value: paletteValue })
            }
          />
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleContinueSolve}
            disabled={computing || countEmpty(board) === CELL_COUNT}
            title={t.continueGame.solveTitle}
          >
            {t.continueGame.solve}
          </button>
          <p className="status">{computing ? t.status.calculating : ''}</p>
        </div>
      )}

      {phase === 'proposal' && suggestion && afterBoard && (
        <div className="stage">
          <p className="instruction instruction--lead">
            <span className="instruction__line">
              <Rich
                text={format(t.proposal.best, { direction: t.directions[suggestion.direction] })}
              />
            </span>{' '}
            <span className="instruction__line">
              <Rich text={t.proposal.next} />
            </span>
          </p>
          {maxTile !== null && afterBoard.some((row) => row.some((v) => v > maxTile)) && (
            <p className="hint hint--warn">{format(t.proposal.capWarn, { next: maxTile * 2 })}</p>
          )}
          {/* A grid, so the tile-value picker sits right under the board it is for. */}
          <div className="comparison">
            <span className="comparison__caption comparison__caption--now">{t.proposal.now}</span>
            <div className="comparison__board comparison__board--now">
              <Board board={board} variant="small" label={t.proposal.boardBefore} />
            </div>
            <DirectionArrow direction={suggestion.direction} />
            <span className="comparison__caption comparison__caption--active">
              {t.proposal.tapSpot}
            </span>
            <div className="comparison__board comparison__board--active">
              <Board
                board={afterBoard}
                variant="small"
                onCellClick={handleAddTileClick}
                onCellAltClick={handleAddTileAltClick}
                label={t.proposal.boardAfter}
                cellHint={format(t.proposal.cellHint, {
                  value: newTileValue,
                  alt: newTileValue === 2 ? 4 : 2,
                })}
              />
            </div>
            <div className="comparison__picker">
              <div className="addtile">
                <span className="addtile__label">{t.proposal.newTileValue}</span>
                <NumberSelector value={newTileValue} onChange={setNewTileValue} />
              </div>
              <p className="hint">
                <Rich
                  text={format(t.proposal.tapHint, {
                    value: newTileValue,
                    alt: newTileValue === 2 ? 4 : 2,
                  })}
                />
              </p>
            </div>
          </div>
          <p className="status">{computing ? t.status.calculating : ''}</p>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="stage">
          <div className="gameover">
            <h2>{t.gameOver.title}</h2>
            <Board board={board} variant="small" label={t.gameOver.finalBoard} />
            <button
              type="button"
              className="btn btn--primary"
              onClick={startGame}
              title={t.gameOver.restartTitle}
            >
              {t.gameOver.restart}
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        {phase === 'landing' && languageSwitcher}
        <p className="footer__credit">
          <Rich text={t.footer.credit} />
        </p>
        {/* New tab, so following a link mid-game never loses the board. */}
        <nav className="footer__links" aria-label={t.footer.links}>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={t.footer.donateTitle}
          >
            {t.footer.donate}
          </a>
          <a href={BUG_REPORT_URL} target="_blank" rel="noopener noreferrer">
            {t.footer.bug}
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            {t.footer.source}
          </a>
        </nav>
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

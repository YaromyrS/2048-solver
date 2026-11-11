'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { useMessages } from '@/components/I18nProvider';
import { type Board as BoardType, type Position } from '@/lib/game/board';
import { format } from '@/lib/i18n/format';
import type { Messages } from '@/lib/i18n/messages/en';

interface BoardProps {
  board: BoardType;
  variant?: 'normal' | 'small';
  /** When provided, empty cells become clickable targets for placing a tile. */
  onCellClick?: (pos: Position) => void;
  /**
   * Alternate placement — right-click on mouse, long-press on touch — used to
   * place the alternate tile value without switching the selector. Suppresses
   * the browser context menu on those cells.
   */
  onCellAltClick?: (pos: Position) => void;
  /**
   * When true, occupied cells are clickable too — for the manual board editor
   * where any cell can be overwritten or erased.
   */
  allowOverwrite?: boolean;
  /** Cells to mark for a second look, e.g. tiles a screenshot was read with low confidence. */
  flagged?: readonly (readonly boolean[])[];
  /**
   * Accessible name, e.g. "Board after the move". A board with no clickable
   * cells is exposed as one image whose name lists every row's tiles.
   */
  label?: string;
  /** Tooltip on clickable cells saying what a tap does, e.g. "Place 8 here". */
  cellHint?: string;
}

/** "row 1: 2, empty, empty, 4; row 2: …" — the board as screen-reader text. */
function describeBoard(board: BoardType, t: Messages['board']): string {
  return board
    .map((row, r) =>
      format(t.row, { row: r + 1, cells: row.map((v) => (v === 0 ? t.empty : v)).join(', ') }),
    )
    .join('; ');
}

/** CSS class carrying the classic-2048 colour for a tile value. */
function tileClass(value: number): string {
  return value <= 2048 ? `tile-${value}` : 'tile-super';
}

/** Shrink the font as the number grows so it always fits the cell. */
function fontSizeFor(value: number, variant: 'normal' | 'small'): number {
  const base = value < 100 ? 44 : value < 1000 ? 36 : value < 10000 ? 30 : 24;
  return variant === 'small' ? Math.round(base * 0.6) : base;
}

const SMALL_SIZING: CSSProperties = {
  ['--cell-size' as string]: '60px',
  ['--gap' as string]: '8px',
};

/** Hold duration that counts as a long-press on touch. */
const LONG_PRESS_MS = 450;

/**
 * Long-press bookkeeping. One board never has two simultaneous presses we care
 * about, so a single ref suffices.
 *
 * `lastPointerType` disambiguates the `contextmenu` event: Android fires it for
 * touch long-presses (which our own timer already handles), iOS doesn't fire it
 * at all, and mouse right-clicks always fire it. Only the mouse case may place
 * a tile from `contextmenu`, otherwise Android would place twice.
 */
interface PressState {
  timer: ReturnType<typeof setTimeout> | null;
  /** Cell where a long-press already placed a tile; swallows the trailing click. */
  firedPos: Position | null;
  lastPointerType: string;
}

export function Board({
  board,
  variant = 'normal',
  onCellClick,
  onCellAltClick,
  allowOverwrite = false,
  flagged,
  label,
  cellHint,
}: BoardProps) {
  const t = useMessages().board;
  const style = variant === 'small' ? SMALL_SIZING : undefined;
  const press = useRef<PressState>({ timer: null, firedPos: null, lastPointerType: 'mouse' });

  const cancelLongPress = () => {
    if (press.current.timer !== null) {
      clearTimeout(press.current.timer);
      press.current.timer = null;
    }
  };

  useEffect(() => cancelLongPress, []);

  const interactive = onCellClick !== undefined;
  const a11y = interactive
    ? { role: 'group', 'aria-label': label }
    : label
      ? { role: 'img', 'aria-label': `${label}: ${describeBoard(board, t)}` }
      : {};

  return (
    <div className={`board board--${variant}`} style={style} {...a11y}>
      {board.map((row, r) =>
        row.map((value, c) => {
          const clickable = onCellClick !== undefined && (value === 0 || allowOverwrite);
          const pos: Position = { row: r, col: c };

          const handleClick = clickable
            ? () => {
                // A long-press already placed here; ignore the click that
                // follows when the finger lifts.
                const fired = press.current.firedPos;
                if (fired && fired.row === r && fired.col === c) {
                  press.current.firedPos = null;
                  return;
                }
                onCellClick(pos);
              }
            : undefined;

          const handlePointerDown =
            clickable && onCellAltClick
              ? (e: PointerEvent<HTMLDivElement>) => {
                  press.current.lastPointerType = e.pointerType;
                  // a new press always starts clean — a stale firedPos from a
                  // long-press whose click never arrived must not eat this tap
                  press.current.firedPos = null;
                  if (e.pointerType !== 'touch') return;
                  cancelLongPress();
                  press.current.timer = setTimeout(() => {
                    press.current.timer = null;
                    press.current.firedPos = pos;
                    navigator.vibrate?.(30);
                    onCellAltClick(pos);
                  }, LONG_PRESS_MS);
                }
              : undefined;

          const handleContext =
            clickable && onCellAltClick
              ? (e: MouseEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  if (press.current.lastPointerType !== 'touch') onCellAltClick(pos);
                }
              : undefined;

          const handleKey = clickable
            ? (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCellClick(pos);
                }
              }
            : undefined;

          const classes = ['cell'];
          if (value !== 0) classes.push('tile', tileClass(value));
          if (clickable) classes.push('cell--clickable');
          const isFlagged = flagged?.[r]?.[c] === true;
          if (isFlagged) classes.push('cell--flagged');
          const cellLabel = format(t.cell, {
            what: value === 0 ? t.emptyCell : format(t.tile, { value }),
            row: r + 1,
            col: c + 1,
          });

          return (
            <div
              key={`${r}-${c}`}
              className={classes.join(' ')}
              style={value !== 0 ? { fontSize: `${fontSizeFor(value, variant)}px` } : undefined}
              onClick={handleClick}
              onPointerDown={handlePointerDown}
              onPointerUp={cancelLongPress}
              onPointerCancel={cancelLongPress}
              onPointerLeave={cancelLongPress}
              onContextMenu={handleContext}
              onKeyDown={handleKey}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={
                clickable
                  ? isFlagged
                    ? format(t.flagged, { label: cellLabel })
                    : cellLabel
                  : undefined
              }
              title={clickable ? cellHint : undefined}
            >
              {value !== 0 ? value : ''}
            </div>
          );
        }),
      )}
    </div>
  );
}

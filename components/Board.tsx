'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { type Board as BoardType, type Position } from '@/lib/game/board';

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
}: BoardProps) {
  const style = variant === 'small' ? SMALL_SIZING : undefined;
  const press = useRef<PressState>({ timer: null, firedPos: null, lastPointerType: 'mouse' });

  const cancelLongPress = () => {
    if (press.current.timer !== null) {
      clearTimeout(press.current.timer);
      press.current.timer = null;
    }
  };

  useEffect(() => cancelLongPress, []);

  return (
    <div className={`board board--${variant}`} style={style}>
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
                  ? `${value === 0 ? 'Place tile at' : 'Change tile at'} row ${r + 1}, column ${c + 1}`
                  : undefined
              }
            >
              {value !== 0 ? value : ''}
            </div>
          );
        }),
      )}
    </div>
  );
}

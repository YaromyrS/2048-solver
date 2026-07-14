import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { type Board as BoardType, type Position } from '@/lib/game/board';

interface BoardProps {
  board: BoardType;
  variant?: 'normal' | 'small';
  /** When provided, empty cells become clickable targets for placing a tile. */
  onCellClick?: (pos: Position) => void;
  /**
   * Right-click (context menu) on a clickable cell — used to place the
   * alternate tile value without switching the selector. Suppresses the
   * browser context menu on those cells.
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

export function Board({
  board,
  variant = 'normal',
  onCellClick,
  onCellAltClick,
  allowOverwrite = false,
}: BoardProps) {
  const style = variant === 'small' ? SMALL_SIZING : undefined;

  return (
    <div className={`board board--${variant}`} style={style}>
      {board.map((row, r) =>
        row.map((value, c) => {
          const clickable = onCellClick !== undefined && (value === 0 || allowOverwrite);
          const handleClick = clickable ? () => onCellClick({ row: r, col: c }) : undefined;
          const handleContext =
            clickable && onCellAltClick
              ? (e: MouseEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  onCellAltClick({ row: r, col: c });
                }
              : undefined;
          const handleKey = clickable
            ? (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCellClick({ row: r, col: c });
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

import type { ReactNode } from 'react';

/**
 * Line icons drawn on a 24×24 grid and centred on it. Text glyphs (↶ ⌂ ↻) sit
 * at different heights in every platform font, so they never looked centred
 * in the buttons; SVG renders the same everywhere.
 *
 * Decorative: the button around an icon carries the accessible name.
 */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function UndoIcon() {
  return (
    <Icon>
      <path d="M8.5 4.5 4 9l4.5 4.5" />
      <path d="M4 9h10.5a5.25 5.25 0 0 1 0 10.5H10" />
    </Icon>
  );
}

export function HomeIcon() {
  return (
    <Icon>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M6 9.5V20h12V9.5" />
    </Icon>
  );
}

export function RestartIcon() {
  return (
    <Icon>
      <path d="M19.5 12a7.5 7.5 0 1 1-7.5-7.5c2.1 0 4.1.83 5.6 2.28L19.5 9" />
      <path d="M19.5 4.5V9H15" />
    </Icon>
  );
}

export function PauseIcon() {
  return (
    <Icon>
      <path d="M9 6v12M15 6v12" />
    </Icon>
  );
}

export function PlayIcon() {
  return (
    <Icon>
      <path d="M8 5.5v13l10-6.5z" fill="currentColor" />
    </Icon>
  );
}

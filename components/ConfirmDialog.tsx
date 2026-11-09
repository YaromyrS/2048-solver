'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal confirmation used to guard destructive navigation (leaving or
 * restarting a live board). Escape or a click on the backdrop cancels.
 */
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Captured during the first render, before autoFocus moves focus into the
  // dialog (an effect would already see the dialog's own button).
  const [opener] = useState(() => document.activeElement);

  // Closing hands focus back to whatever opened the dialog. Done in the
  // handlers rather than an unmount effect, which StrictMode also runs on mount.
  const close = useCallback(
    (action: () => void) => {
      action();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    },
    [opener],
  );
  const cancel = useCallback(() => close(onCancel), [close, onCancel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancel();
        return;
      }
      // Keep Tab cycling between the dialog's buttons (it is modal).
      if (e.key !== 'Tab' || !modalRef.current) return;
      const buttons = modalRef.current.querySelectorAll<HTMLButtonElement>('button');
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancel]);

  return (
    <div className="modal-overlay" role="presentation" onClick={cancel}>
      <div
        ref={modalRef}
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="modal__title">
          {title}
        </h2>
        <p id="confirm-message" className="modal__message">
          {message}
        </p>
        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={cancel}
            title="Keep this game"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => close(onConfirm)}
            title={message}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMessages } from '@/components/I18nProvider';
import type { BoardReading } from '@/lib/vision/readBoard';

/** The reader and its templates (~40 KB) load on first use, not with the page. */
const loadReader = () =>
  Promise.all([import('@/lib/vision/loadImage'), import('@/lib/vision/readBoard'), import('@/lib/vision/templates')]);

interface ScreenshotImportProps {
  onRead: (reading: BoardReading) => void;
  onError: (message: string) => void;
  disabled?: boolean;
}

/**
 * Fill the board from a screenshot of the user's game: pick an image (on
 * phones this opens the photo library) or paste one from the clipboard. The
 * image is read on the device and never uploaded.
 */
export function ScreenshotImport({ onRead, onError, disabled = false }: ScreenshotImportProps) {
  const t = useMessages().importShot;
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleImage = useCallback(
    async (file: Blob) => {
      setBusy(true);
      let ImageLoadError: (typeof import('@/lib/vision/loadImage'))['ImageLoadError'] | null = null;
      try {
        const [loader, reader, templates] = await loadReader();
        ImageLoadError = loader.ImageLoadError;
        const reading = reader.readBoard(await loader.imageFromFile(file), templates.TEMPLATES);
        if (reading) onRead(reading);
        else onError(t.noBoard);
      } catch (err) {
        if (ImageLoadError && err instanceof ImageLoadError) {
          onError(t[err.code]);
        } else {
          console.error('Screenshot import failed', err);
          onError(t.failed);
        }
      } finally {
        setBusy(false);
      }
    },
    [onRead, onError, t],
  );

  // Ctrl/Cmd+V with a screenshot on the clipboard imports it directly.
  useEffect(() => {
    if (disabled) return;
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith('image/'));
      const file = item?.getAsFile();
      if (!file) return;
      e.preventDefault();
      void handleImage(file);
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [disabled, handleImage]);

  return (
    <div className="import">
      <button
        type="button"
        className="btn btn--ghost import__btn"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || busy}
        title={t.title}
      >
        {busy ? t.reading : t.button}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ''; // picking the same file again must fire change again
          if (file) void handleImage(file);
        }}
      />
      <span className="import__hint">{t.pasteHint}</span>
    </div>
  );
}

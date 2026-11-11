import { Fragment } from 'react';

/**
 * Renders a translated string, turning each `**text**` span into <strong>.
 * Translations keep their emphasis in the text itself, so word order can
 * differ between languages.
 */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

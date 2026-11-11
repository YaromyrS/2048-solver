/**
 * Fill `{name}` placeholders in a translated string. A placeholder without a
 * value stays as written, so the mistake shows on screen rather than vanishing;
 * messages.test.ts checks every language uses the same placeholders as English.
 */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}

/** The `{name}` placeholders a translated string uses, sorted. */
export function placeholders(template: string): string[] {
  return [...template.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

import { describe, expect, it } from 'vitest';
import { format, placeholders } from '@/lib/i18n/format';
import { LOCALES, languageAlternates, localePath, localeUrl } from '@/lib/i18n/locales';
import { MESSAGES } from '@/lib/i18n/messages';
import { SITE_URL } from '@/lib/site';

/** Every string in a dictionary, keyed by its path ("info.faq.2.a"). */
function leaves(value: unknown, path = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof value === 'string') {
    out.set(path, value);
  } else if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      for (const [p, s] of leaves(child, path ? `${path}.${key}` : key)) out.set(p, s);
    }
  }
  return out;
}

const unique = (xs: string[]) => [...new Set(xs)];
const english = leaves(MESSAGES.en);

describe('translations', () => {
  it('has a dictionary for every locale and nothing else', () => {
    expect(Object.keys(MESSAGES).sort()).toEqual(LOCALES.map((l) => l.code).sort());
  });

  for (const { code } of LOCALES) {
    const strings = leaves(MESSAGES[code]);

    describe(code, () => {
      it('has exactly the English keys (including every FAQ entry)', () => {
        expect([...strings.keys()].sort()).toEqual([...english.keys()].sort());
      });

      it('keeps every placeholder and no others', () => {
        for (const [path, text] of strings) {
          expect(unique(placeholders(text)), path).toEqual(unique(placeholders(english.get(path)!)));
        }
      });

      it('has no empty strings and closes every **bold** span', () => {
        for (const [path, text] of strings) {
          expect(text.trim(), path).not.toBe('');
          expect(text.split('**').length % 2, `${path}: unbalanced **`).toBe(1);
        }
      });
    });
  }
});

describe('format', () => {
  it('fills placeholders, repeated ones too', () => {
    expect(format('{a} and {b}, {a}', { a: 1, b: 'two' })).toBe('1 and two, 1');
  });

  it('leaves a placeholder without a value visible', () => {
    expect(format('{a} {missing}', { a: 'x' })).toBe('x {missing}');
  });
});

describe('locale URLs', () => {
  it('keeps English at the bare domain and puts the rest under a prefix', () => {
    expect(localePath('en')).toBe('/');
    expect(localeUrl('en')).toBe(SITE_URL);
    expect(localePath('uk')).toBe('/uk');
    expect(localeUrl('zh-hant')).toBe(`${SITE_URL}/zh-hant`);
  });

  it('lists every hreflang once, plus x-default pointing to English', () => {
    const map = languageAlternates();
    const tags = LOCALES.flatMap((l) => l.hreflang);
    expect(new Set(tags).size).toBe(tags.length);
    expect(Object.keys(map).sort()).toEqual([...tags, 'x-default'].sort());
    expect(map['x-default']).toBe(SITE_URL);
    expect(map['zh-HK']).toBe(`${SITE_URL}/zh-hant`);
  });
});

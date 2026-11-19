import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SeasonalDecoration from '../src/components/SeasonalDecoration';
import { getSeason } from '../src/components/season';

describe('サイト全体の季節装飾', () => {
  it('端末の日付の月から季節を選ぶ', () => {
    const expected = [
      'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
      'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter',
    ];

    for (const [index, season] of expected.entries()) {
      expect(getSeason(new Date(2026, index, 15))).toBe(season);
    }
  });

  it('装飾は読み上げ対象にせず、季節に応じた要素だけを表示する', () => {
    const season = getSeason(new Date());
    const html = renderToStaticMarkup(<SeasonalDecoration />);

    expect(html).toContain(`seasonal-decoration--${season}`);
    expect(html).toContain('aria-hidden="true"');
    expect(html.match(/class="seasonal-particle"/g)?.length).toBeGreaterThan(0);
  });
});

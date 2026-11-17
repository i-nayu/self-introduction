import { describe, expect, test } from 'vitest';
import { INTERNSHIPS } from '../../src/data/internships';

describe('インターン経験データ', () => {
  test('経験が1件以上あり、IDが重複しない', () => {
    expect(INTERNSHIPS.length).toBeGreaterThan(0);
    expect(new Set(INTERNSHIPS.map((experience) => experience.id)).size).toBe(INTERNSHIPS.length);
  });

  test('各経験にID・期間・担当・具体的な作業・学びを記載する', () => {
    for (const experience of INTERNSHIPS) {
      for (const text of [
        experience.id,
        experience.title,
        experience.duration,
        experience.role,
        experience.summary,
        experience.learning,
      ]) {
        expect(text.trim()).not.toBe('');
      }
      expect(experience.contributions.length).toBeGreaterThan(0);
      for (const contribution of experience.contributions) {
        expect(contribution.trim()).not.toBe('');
      }
      for (const technology of experience.technologies ?? []) {
        expect(technology.trim()).not.toBe('');
      }
    }
  });
});

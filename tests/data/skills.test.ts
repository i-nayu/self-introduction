import { describe, expect, test } from 'vitest'
import { SKILL_GROUPS } from '../../src/data/skills'

describe('スキルデータ', () => {
  test('Frontend、Backend、Otherのカテゴリが1つずつある', () => {
    expect(SKILL_GROUPS.map((group) => group.id).sort()).toEqual([
      'backend',
      'frontend',
      'other',
    ])
  })

  test('カテゴリ名・説明・各スキル名が空でなく、同じカテゴリ内で重複しない', () => {
    for (const group of SKILL_GROUPS) {
      expect(group.label.trim()).not.toBe('')
      expect(group.description.trim()).not.toBe('')
      expect(new Set(group.skills).size).toBe(group.skills.length)
      for (const skill of group.skills) {
        expect(skill.trim()).not.toBe('')
      }
    }
  })
})

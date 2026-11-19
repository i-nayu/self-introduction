import { describe, expect, test } from 'vitest'
import { INTERNSHIPS } from '../../src/data/internships'
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

  test('インターンで使用した技術は技術スタックにも掲載する', () => {
    const listedSkills = new Set(SKILL_GROUPS.flatMap((group) => group.skills))

    for (const experience of INTERNSHIPS) {
      for (const technology of experience.technologies ?? []) {
        expect(listedSkills.has(technology)).toBe(true)
      }
    }
  })
})

import { existsSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { PROFILE } from '../../src/data/profile'

describe('プロフィールデータ', () => {
  test('表示に必要な文字が設定されている', () => {
    expect(PROFILE.name.trim()).not.toBe('')
    expect(PROFILE.affiliation.trim()).not.toBe('')
    expect(PROFILE.about.trim()).not.toBe('')
  })

  test('プロフィール画像が存在する', () => {
    expect(PROFILE.avatarUrl).toMatch(/^\/[A-Za-z0-9._-]+$/)
    expect(existsSync(new URL(`../../public${PROFILE.avatarUrl}`, import.meta.url))).toBe(true)
  })

  test('興味分野が空でなく、重複しない', () => {
    expect(PROFILE.interests.length).toBeGreaterThan(0)
    expect(new Set(PROFILE.interests).size).toBe(PROFILE.interests.length)
    for (const interest of PROFILE.interests) {
      expect(interest.trim()).not.toBe('')
    }
  })

  test('SNSリンクはHTTPSである', () => {
    expect(new URL(PROFILE.xUrl).protocol).toBe('https:')
    expect(new URL(PROFILE.githubUrl).protocol).toBe('https:')
  })
})

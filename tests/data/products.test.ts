import { existsSync } from 'node:fs'
import { describe, expect, test } from 'vitest'
import { PRODUCTS } from '../../src/data/products'

describe('制作物データ', () => {
  test('slugが重複せず、URLに使える形式である', () => {
    const slugs = PRODUCTS.map((product) => product.slug)

    expect(slugs.length).toBeGreaterThan(0)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  test('注目作品が3件ある', () => {
    expect(PRODUCTS.filter((product) => product.featured)).toHaveLength(3)
  })

  test('各作品にタイトルと表示できる画像がある', () => {
    for (const product of PRODUCTS) {
      expect(product.title.trim()).not.toBe('')
      expect(product.imageUrl).toMatch(/^\/[A-Za-z0-9._-]+$/)
      expect(existsSync(new URL(`../../public${product.imageUrl}`, import.meta.url))).toBe(true)
    }
  })

  test('設定された外部リンクはHTTPSである', () => {
    for (const product of PRODUCTS) {
      for (const link of [product.githubUrl, product.siteUrl]) {
        if (link) {
          expect(new URL(link).protocol).toBe('https:')
        }
      }
    }
  })
})

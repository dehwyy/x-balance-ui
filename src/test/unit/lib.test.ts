import { describe, it, expect } from 'vitest'
import { generateTxId } from '@/shared/lib/uuid'

describe('generateTxId', () => {
  it('returns a UUID string', () => {
    const id = generateTxId()
    expect(typeof id).toBe('string')
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })
})

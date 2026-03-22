import { describe, it, expect } from 'vitest'
import { isDeleted } from '@/entities/user/model/types'
import type { User } from '@/entities/user/model/types'

const baseUser: User = {
  id: 'user-1',
  name: 'Alice',
  overdraftLimit: '100',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('isDeleted', () => {
  it('returns false when deletedAt is absent', () => {
    expect(isDeleted(baseUser)).toBe(false)
  })

  it('returns false when deletedAt is undefined', () => {
    expect(isDeleted({ ...baseUser, deletedAt: undefined })).toBe(false)
  })

  it('returns true when deletedAt is a date string', () => {
    expect(isDeleted({ ...baseUser, deletedAt: '2024-06-01T00:00:00Z' })).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import type { TransactionType } from '@/entities/transaction/model/types'

// Pure helpers extracted from TransactionsTableWidget
const POSITIVE_TYPES: TransactionType[] = [
  'TRANSACTION_TYPE_CREDIT',
  'TRANSACTION_TYPE_FREEZE_RELEASE',
]
const NEGATIVE_TYPES: TransactionType[] = ['TRANSACTION_TYPE_DEBIT', 'TRANSACTION_TYPE_FREEZE_HOLD']

function amountClass(type: TransactionType): string {
  if (POSITIVE_TYPES.includes(type)) return 'text-green-500 tabular-nums'
  if (NEGATIVE_TYPES.includes(type)) return 'text-destructive tabular-nums'
  return 'tabular-nums'
}

function amountPrefix(type: TransactionType): string {
  if (POSITIVE_TYPES.includes(type)) return '+'
  if (NEGATIVE_TYPES.includes(type)) return '-'
  return ''
}

function truncateTxId(id: string): string {
  if (id.length <= 12) return id
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

describe('amountClass', () => {
  it('returns green class for CREDIT', () => {
    expect(amountClass('TRANSACTION_TYPE_CREDIT')).toContain('text-green-500')
  })

  it('returns green class for FREEZE_RELEASE', () => {
    expect(amountClass('TRANSACTION_TYPE_FREEZE_RELEASE')).toContain('text-green-500')
  })

  it('returns destructive class for DEBIT', () => {
    expect(amountClass('TRANSACTION_TYPE_DEBIT')).toContain('text-destructive')
  })

  it('returns destructive class for FREEZE_HOLD', () => {
    expect(amountClass('TRANSACTION_TYPE_FREEZE_HOLD')).toContain('text-destructive')
  })
})

describe('amountPrefix', () => {
  it('returns + for CREDIT', () => {
    expect(amountPrefix('TRANSACTION_TYPE_CREDIT')).toBe('+')
  })

  it('returns - for DEBIT', () => {
    expect(amountPrefix('TRANSACTION_TYPE_DEBIT')).toBe('-')
  })

  it('returns - for FREEZE_HOLD', () => {
    expect(amountPrefix('TRANSACTION_TYPE_FREEZE_HOLD')).toBe('-')
  })

  it('returns + for FREEZE_RELEASE', () => {
    expect(amountPrefix('TRANSACTION_TYPE_FREEZE_RELEASE')).toBe('+')
  })
})

describe('truncateTxId', () => {
  it('returns short ids as-is', () => {
    expect(truncateTxId('abc123')).toBe('abc123')
    expect(truncateTxId('exactly12c')).toBe('exactly12c')
  })

  it('truncates long ids with ellipsis', () => {
    const id = 'abcdefgh-1234-5678-9abc-def012345678'
    const result = truncateTxId(id)
    expect(result).toBe('abcdefgh…5678')
    expect(result.length).toBeLessThan(id.length)
  })
})

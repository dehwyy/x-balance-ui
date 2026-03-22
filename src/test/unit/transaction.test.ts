import { describe, it, expect } from 'vitest'
import { TX_TYPE_LABELS, TX_TYPE_COLORS } from '@/entities/transaction/model/types'
import type { TransactionType } from '@/entities/transaction/model/types'

const ALL_TYPES: TransactionType[] = [
  'TRANSACTION_TYPE_CREDIT',
  'TRANSACTION_TYPE_DEBIT',
  'TRANSACTION_TYPE_FREEZE_HOLD',
  'TRANSACTION_TYPE_FREEZE_RELEASE',
]

describe('TX_TYPE_LABELS', () => {
  it('has a label for every transaction type', () => {
    for (const type of ALL_TYPES) {
      expect(TX_TYPE_LABELS[type]).toBeTruthy()
    }
  })
})

describe('TX_TYPE_COLORS', () => {
  it('has a color class for every transaction type', () => {
    for (const type of ALL_TYPES) {
      expect(TX_TYPE_COLORS[type]).toBeTruthy()
    }
  })
})

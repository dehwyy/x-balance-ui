import type { Transaction, User } from '../../types'

const USER_1_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const USER_2_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901'
const USER_3_ID = 'c3d4e5f6-a7b8-9012-cdef-123456789012'

const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString()

export const seedUsers: User[] = [
  {
    id: USER_1_ID,
    name: 'Алексей Петров',
    overdraftLimit: '500.00',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(2),
  },
  {
    id: USER_2_ID,
    name: 'Мария Соколова',
    overdraftLimit: '0.00',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(10),
  },
  {
    id: USER_3_ID,
    name: 'Дмитрий Иванов',
    overdraftLimit: '1000.00',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1),
  },
]

export const seedTransactions: Transaction[] = [
  // User 1
  {
    id: crypto.randomUUID(),
    userId: USER_1_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '1500.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(28),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_1_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '200.50',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(25),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_1_ID,
    type: 'TRANSACTION_TYPE_FREEZE_HOLD',
    amount: '300.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(20),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_1_ID,
    type: 'TRANSACTION_TYPE_FREEZE_RELEASE',
    amount: '300.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(18),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_1_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '750.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(10),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_1_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '99.99',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(3),
  },

  // User 2
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '5000.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(55),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '1200.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(50),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_FREEZE_HOLD',
    amount: '500.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(45),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '2500.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(30),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '350.75',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(15),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_FREEZE_RELEASE',
    amount: '500.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(12),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_2_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '89.50',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(5),
  },

  // User 3
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '10000.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(85),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '3500.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(80),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_FREEZE_HOLD',
    amount: '1000.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(70),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '2000.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(60),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_FREEZE_RELEASE',
    amount: '1000.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(55),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '450.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(40),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_CREDIT',
    amount: '1500.00',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(20),
  },
  {
    id: crypto.randomUUID(),
    userId: USER_3_ID,
    type: 'TRANSACTION_TYPE_DEBIT',
    amount: '275.25',
    transactionId: crypto.randomUUID(),
    createdAt: daysAgo(7),
  },
]

export const seedBalances: Record<string, { available: string; frozen: string; total: string }> = {
  [USER_1_ID]: { available: '1649.51', frozen: '0.00', total: '1649.51' },
  [USER_2_ID]: { available: '5359.75', frozen: '0.00', total: '5359.75' },
  [USER_3_ID]: { available: '8274.75', frozen: '0.00', total: '8274.75' },
}

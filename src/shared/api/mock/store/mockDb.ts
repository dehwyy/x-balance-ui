import { reactive } from 'vue'
import type { Transaction, User } from '../../types'
import { seedBalances, seedTransactions, seedUsers } from './seedData'

interface Balance {
  available: string
  frozen: string
  total: string
}

type BalanceStore = Record<string, Balance>

function deepCloneUsers(): User[] {
  return seedUsers.map((u) => ({ ...u }))
}

function deepCloneTransactions(): Transaction[] {
  return seedTransactions.map((t) => ({ ...t }))
}

function deepCloneBalances(): BalanceStore {
  const result: BalanceStore = {}
  for (const [k, v] of Object.entries(seedBalances)) {
    result[k] = { ...v }
  }
  return result
}

export const mockDb = reactive({
  users: deepCloneUsers(),
  transactions: deepCloneTransactions(),
  balances: deepCloneBalances() as BalanceStore,

  reset() {
    mockDb.users = deepCloneUsers()
    mockDb.transactions = deepCloneTransactions()
    mockDb.balances = deepCloneBalances()
  },

  findUser(id: string): User | undefined {
    return mockDb.users.find((u) => u.id === id)
  },

  createUser(data: { name: string; overdraftLimit: string }): User {
    const now = new Date().toISOString()
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      overdraftLimit: data.overdraftLimit,
      createdAt: now,
      updatedAt: now,
    }
    mockDb.users.push(user)
    mockDb.balances[user.id] = { available: '0.00', frozen: '0.00', total: '0.00' }
    return user
  },

  updateUser(id: string, patch: { name?: string; overdraftLimit?: string }): User | undefined {
    const idx = mockDb.users.findIndex((u) => u.id === id)
    if (idx === -1) return undefined
    mockDb.users[idx] = {
      ...mockDb.users[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    return mockDb.users[idx]
  },

  deleteUser(id: string): void {
    const idx = mockDb.users.findIndex((u) => u.id === id)
    if (idx !== -1) {
      mockDb.users[idx] = {
        ...mockDb.users[idx],
        deletedAt: new Date().toISOString(),
      }
    }
  },

  getBalance(userId: string): Balance {
    return mockDb.balances[userId] ?? { available: '0.00', frozen: '0.00', total: '0.00' }
  },

  findTransactions(
    userId: string,
    params?: { limit?: number; offset?: number; from?: string; to?: string },
  ): { transactions: Transaction[]; total: string } {
    let result = mockDb.transactions.filter((t) => t.userId === userId)

    if (params?.from) {
      const from = new Date(params.from).getTime()
      result = result.filter((t) => new Date(t.createdAt).getTime() >= from)
    }
    if (params?.to) {
      const to = new Date(params.to).getTime()
      result = result.filter((t) => new Date(t.createdAt).getTime() <= to)
    }

    result = [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    const total = result.length
    const offset = params?.offset ?? 0
    const limit = params?.limit ?? 20
    return { transactions: result.slice(offset, offset + limit), total: String(total) }
  },

  findTransaction(userId: string, txId: string): Transaction | undefined {
    return mockDb.transactions.find((t) => t.userId === userId && t.id === txId)
  },

  creditBalance(userId: string, amount: string, txId: string): string {
    const b = mockDb.getBalance(userId)
    const newAvailable = (parseFloat(b.available) + parseFloat(amount)).toFixed(2)
    const newTotal = (parseFloat(b.total) + parseFloat(amount)).toFixed(2)
    mockDb.balances[userId] = { available: newAvailable, frozen: b.frozen, total: newTotal }
    mockDb.transactions.push({
      id: crypto.randomUUID(),
      userId,
      type: 'TRANSACTION_TYPE_CREDIT',
      amount,
      transactionId: txId,
      createdAt: new Date().toISOString(),
    })
    return newAvailable
  },

  debitBalance(userId: string, amount: string, txId: string): string {
    const b = mockDb.getBalance(userId)
    const user = mockDb.findUser(userId)
    const overdraft = parseFloat(user?.overdraftLimit ?? '0')
    const current = parseFloat(b.available)
    const debitAmount = parseFloat(amount)
    if (current - debitAmount < -overdraft) {
      throw new Error('Insufficient funds')
    }
    const newAvailable = (current - debitAmount).toFixed(2)
    const newTotal = (parseFloat(b.total) - debitAmount).toFixed(2)
    mockDb.balances[userId] = { available: newAvailable, frozen: b.frozen, total: newTotal }
    mockDb.transactions.push({
      id: crypto.randomUUID(),
      userId,
      type: 'TRANSACTION_TYPE_DEBIT',
      amount,
      transactionId: txId,
      createdAt: new Date().toISOString(),
    })
    return newAvailable
  },

  freezeBalance(userId: string, amount: string, txId: string): { frozenAmount: string } {
    const b = mockDb.getBalance(userId)
    const debitAmount = parseFloat(amount)
    const newAvailable = (parseFloat(b.available) - debitAmount).toFixed(2)
    const newFrozen = (parseFloat(b.frozen) + debitAmount).toFixed(2)
    mockDb.balances[userId] = { available: newAvailable, frozen: newFrozen, total: b.total }
    mockDb.transactions.push({
      id: crypto.randomUUID(),
      userId,
      type: 'TRANSACTION_TYPE_FREEZE_HOLD',
      amount,
      transactionId: txId,
      createdAt: new Date().toISOString(),
    })
    return { frozenAmount: amount }
  },

  unfreezeBalance(userId: string, txId: string): { unfrozenAmount: string } {
    const freezeTx = mockDb.transactions.find(
      (t) =>
        t.userId === userId &&
        t.transactionId === txId &&
        t.type === 'TRANSACTION_TYPE_FREEZE_HOLD',
    )
    if (!freezeTx) {
      throw new Error('Freeze transaction not found')
    }
    const amount = freezeTx.amount
    const b = mockDb.getBalance(userId)
    const unfreezeAmount = parseFloat(amount)
    const newFrozen = Math.max(0, parseFloat(b.frozen) - unfreezeAmount).toFixed(2)
    const newAvailable = (parseFloat(b.available) + unfreezeAmount).toFixed(2)
    mockDb.balances[userId] = { available: newAvailable, frozen: newFrozen, total: b.total }
    mockDb.transactions.push({
      id: crypto.randomUUID(),
      userId,
      type: 'TRANSACTION_TYPE_FREEZE_RELEASE',
      amount,
      transactionId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    })
    return { unfrozenAmount: amount }
  },
})

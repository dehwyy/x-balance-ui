export interface User {
  id: string
  name: string
  overdraftLimit: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface Balance {
  available: string
  frozen: string
  total: string
}

export type TransactionType =
  | 'TRANSACTION_TYPE_CREDIT'
  | 'TRANSACTION_TYPE_DEBIT'
  | 'TRANSACTION_TYPE_FREEZE_HOLD'
  | 'TRANSACTION_TYPE_FREEZE_RELEASE'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: string
  transactionId: string
  createdAt: string
}

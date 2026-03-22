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

export const TX_TYPE_LABELS: Record<TransactionType, string> = {
  TRANSACTION_TYPE_CREDIT: 'Credit',
  TRANSACTION_TYPE_DEBIT: 'Debit',
  TRANSACTION_TYPE_FREEZE_HOLD: 'Freeze',
  TRANSACTION_TYPE_FREEZE_RELEASE: 'Unfreeze',
}

export const TX_TYPE_COLORS: Record<TransactionType, string> = {
  TRANSACTION_TYPE_CREDIT: 'text-green-500',
  TRANSACTION_TYPE_DEBIT: 'text-red-500',
  TRANSACTION_TYPE_FREEZE_HOLD: 'text-amber-500',
  TRANSACTION_TYPE_FREEZE_RELEASE: 'text-blue-500',
}

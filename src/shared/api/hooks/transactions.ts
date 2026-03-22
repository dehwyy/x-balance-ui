import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRef, toValue } from 'vue'
import { apiClient } from '../client'
import type { Transaction } from '../types'
import { userKeys } from './users'

interface ListTransactionsParams {
  limit?: number
  offset?: number
  from?: string
  to?: string
}

interface ListTransactionsResponse {
  transactions: Transaction[]
  total: string
}

interface GetTransactionResponse {
  transaction: Transaction
}

export function useListTransactions(
  userId: MaybeRef<string>,
  params?: MaybeRef<ListTransactionsParams>,
) {
  return useQuery({
    queryKey: computed(() => userKeys.transactions(toValue(userId), toValue(params))),
    queryFn: () => {
      const id = toValue(userId)
      const p = toValue(params) ?? {}
      const searchParams = new URLSearchParams()
      if (p.limit !== undefined) searchParams.set('limit', String(p.limit))
      if (p.offset !== undefined) searchParams.set('offset', String(p.offset))
      if (p.from) searchParams.set('from', p.from)
      if (p.to) searchParams.set('to', p.to)
      const query = searchParams.toString()
      return apiClient<ListTransactionsResponse>(
        `/v1/users/${id}/transactions${query ? `?${query}` : ''}`,
      )
    },
    enabled: () => !!toValue(userId),
  })
}

export function useGetTransaction(userId: MaybeRef<string>, txId: MaybeRef<string>) {
  return useQuery({
    queryKey: computed(() => [...userKeys.transactions(toValue(userId)), toValue(txId)]),
    queryFn: () =>
      apiClient<GetTransactionResponse>(
        `/v1/users/${toValue(userId)}/transactions/${toValue(txId)}`,
      ),
    enabled: () => !!toValue(userId) && !!toValue(txId),
  })
}

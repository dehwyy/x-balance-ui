import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { toValue } from 'vue'
import { toast } from 'vue-sonner'
import { apiClient } from '../client'
import { userKeys } from './users'

interface BalanceResponse {
  available: string
  frozen: string
  total: string
}

interface CreditDebitPayload {
  amount: string
  transactionId: string
}

interface CreditDebitResponse {
  newBalance: string
  transactionId: string
}

interface FreezePayload {
  amount: string
  transactionId: string
  freezeTimeoutSeconds?: number
}

interface FreezeResponse {
  frozenAmount: string
  transactionId: string
}

interface UnfreezePayload {
  transactionId: string
}

interface UnfreezeResponse {
  unfrozenAmount: string
  transactionId: string
}

export function useGetBalance(userId: MaybeRef<string>) {
  return useQuery({
    queryKey: userKeys.balance(toValue(userId)),
    queryFn: () => apiClient<BalanceResponse>(`/v1/users/${toValue(userId)}/balance`),
    enabled: () => !!toValue(userId),
  })
}

export function useCredit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: CreditDebitPayload }) =>
      apiClient<CreditDebitResponse>(`/v1/users/${userId}/balance/credit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.balance(userId) })
      queryClient.invalidateQueries({
        queryKey: userKeys.transactions(userId),
      })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to credit balance')
    },
  })
}

export function useDebit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: CreditDebitPayload }) =>
      apiClient<CreditDebitResponse>(`/v1/users/${userId}/balance/debit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.balance(userId) })
      queryClient.invalidateQueries({
        queryKey: userKeys.transactions(userId),
      })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to debit balance')
    },
  })
}

export function useFreeze() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: FreezePayload }) =>
      apiClient<FreezeResponse>(`/v1/users/${userId}/balance/freeze`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.balance(userId) })
      queryClient.invalidateQueries({
        queryKey: userKeys.transactions(userId),
      })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to freeze balance')
    },
  })
}

export function useUnfreeze() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UnfreezePayload }) =>
      apiClient<UnfreezeResponse>(`/v1/users/${userId}/balance/unfreeze`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.balance(userId) })
      queryClient.invalidateQueries({
        queryKey: userKeys.transactions(userId),
      })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to unfreeze balance')
    },
  })
}

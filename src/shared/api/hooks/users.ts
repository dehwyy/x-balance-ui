import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { toValue } from 'vue'
import { toast } from 'vue-sonner'
import { apiClient } from '../client'
import type { User } from '../types'

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
  balance: (id: string) => ['users', id, 'balance'] as const,
  transactions: (id: string, params?: object) => ['users', id, 'transactions', params] as const,
}

interface UsersResponse {
  users: User[]
}

interface UserResponse {
  user: User
}

interface CreateUserPayload {
  name: string
  overdraftLimit: string
}

interface UpdateUserPayload {
  name?: string
  overdraftLimit?: string
}

export function useGetUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => apiClient<UsersResponse>('/v1/users'),
  })
}

export function useGetUser(id: MaybeRef<string>) {
  return useQuery({
    queryKey: userKeys.detail(toValue(id)),
    queryFn: () => apiClient<UserResponse>(`/v1/users/${toValue(id)}`),
    enabled: () => !!toValue(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      apiClient<UserResponse>('/v1/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to create user')
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      apiClient<UserResponse>(`/v1/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(data.user.id),
      })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to update user')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<Record<string, never>>(`/v1/users/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to delete user')
    },
  })
}

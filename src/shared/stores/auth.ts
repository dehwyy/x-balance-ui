import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface AuthUser {
  name: string
  initials: string
  avatarUrl?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function login(u: AuthUser) {
    user.value = u
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})

/**
 * Paylonium Auth Service
 *
 * Uses @dehwyyy/auth/v2 package.
 * Install: bun add @dehwyyy/auth
 *
 * This module exports the three building blocks needed for auth:
 *   1. baseAuthService  — low-level token management (refresh, logout)
 *   2. AuthServiceInstance — high-level service (getMe, isAuthenticated)
 *   3. guard             — Vue Router guard that checks auth on every navigation
 *
 * Usage in router:
 *   import { guard } from '@/shared/api/auth/service'
 *   router.beforeEach(guard.handle)
 *
 * Usage in a component / store to get the current user:
 *   const user = await AuthServiceInstance.getMe()
 *   // user: { user_id, roles, ... } | null
 */

// NOTE: uncomment when @dehwyyy/auth is installed
// import {
//   AuthService,
//   BaseAuthClientInstance,
//   BaseAuthService,
//   CreateAuthClientInstance,
//   RouterAuthGuard,
// } from '@dehwyyy/auth/v2'
// import { useAuthStore } from '@/shared/stores'
// import { AUTH_APP_NAME, AUTH_BASE_URL, AUTH_LOGIN_URL, BASE_SERVICE_URL } from './config'
//
// const baseClient   = BaseAuthClientInstance(AUTH_BASE_URL)
// export const baseAuthService    = new BaseAuthService(baseClient)
//
// const authClient   = CreateAuthClientInstance(AUTH_BASE_URL, baseAuthService)
// export const AuthServiceInstance = new AuthService(baseAuthService, authClient, AUTH_LOGIN_URL)
//
// export const guard = new RouterAuthGuard(AuthServiceInstance, {
//   app: AUTH_APP_NAME,
//   cacheTTL: 10,             // seconds to cache getMe result
//   fallbackPage: '/',        // redirect here if not authenticated
//   baseServiceURL: BASE_SERVICE_URL,
//   onGetMe: (user) => {
//     const authStore = useAuthStore()
//     if (user) {
//       authStore.login({
//         name: user.user_id,   // replace with display name field if available
//         initials: user.user_id.slice(0, 2).toUpperCase(),
//       })
//     } else {
//       authStore.logout()
//     }
//   },
// })

export {}

/**
 * Paylonium auth configuration.
 * Switch BASE_URL / LOGIN_URL to change the auth provider.
 */

export const AUTH_BASE_URL = 'https://auth.my-paylonium.com/api/v1'
export const AUTH_LOGIN_URL = 'https://auth.my-paylonium.com/login'
export const AUTH_APP_NAME = 'x-balance'

/**
 * The base URL of this service (used by RouterAuthGuard to build
 * cross-service redirect URLs).
 */
export const BASE_SERVICE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:5173'

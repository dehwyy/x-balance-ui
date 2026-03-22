/**
 * Authenticated API client builder (Paylonium)
 *
 * Wraps @dehwyyy/auth/v2 ClientBuilder with the app's OpenAPI schema.
 * The client automatically attaches auth cookies / headers via the
 * baseAuthService middleware.
 *
 * Usage:
 *   import { apiClient } from '@/shared/api/auth/client'
 *   const data = await apiClient.GET('/some/path', { params: { ... } })
 */

// NOTE: uncomment when @dehwyyy/auth is installed and openapi schema is generated
// import { ClientBuilder } from '@dehwyyy/auth/v2'
// import type { paths } from '@/shared/api/generated/schema'  // orval / openapi-typescript
// import { BASE_SERVICE_URL } from './config'
//
// export const apiClient = new ClientBuilder<paths>()
//   .build({
//     baseUrl: BASE_SERVICE_URL,
//     credentials: 'include',
//   })

export {}

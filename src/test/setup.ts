import { vi } from 'vitest'

// Stub crypto.randomUUID for deterministic tests
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => '00000000-0000-0000-0000-000000000000'),
  },
})

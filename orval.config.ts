import { defineConfig } from 'orval'

export default defineConfig({
  'x-balance': {
    input: {
      target: 'http://localhost:50051/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/generated',
      schemas: 'src/shared/api/generated/model',
      client: 'vue-query',
      override: {
        mutator: {
          path: 'src/shared/api/client.ts',
          name: 'apiClient',
        },
      },
    },
  },
})

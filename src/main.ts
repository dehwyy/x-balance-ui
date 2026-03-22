import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { installQuery } from './app/providers/query'
import { router } from './app/router'
import { i18n } from './shared/i18n'

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const { worker } = await import('./shared/api/mock/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  installQuery(app)
  app.mount('#app')
}

bootstrap()

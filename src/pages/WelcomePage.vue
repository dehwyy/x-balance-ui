<script setup lang="ts">
import { ArrowRight, HelpCircle, History, Users, Wallet } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ROUTES } from '@/shared/config/routes'

const { t } = useI18n()
const router = useRouter()

const features = [
  {
    icon: Users,
    titleKey: 'welcome.features.users.title' as const,
    descKey: 'welcome.features.users.desc' as const,
    color: 'text-blue-400',
  },
  {
    icon: Wallet,
    titleKey: 'welcome.features.balance.title' as const,
    descKey: 'welcome.features.balance.desc' as const,
    color: 'text-green-400',
  },
  {
    icon: History,
    titleKey: 'welcome.features.transactions.title' as const,
    descKey: 'welcome.features.transactions.desc' as const,
    color: 'text-amber-400',
  },
  {
    icon: HelpCircle,
    titleKey: 'welcome.features.faq.title' as const,
    descKey: 'welcome.features.faq.desc' as const,
    color: 'text-purple-400',
  },
]
</script>

<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto flex flex-col gap-10 py-4">
      <!-- Hero -->
      <div class="text-center flex flex-col gap-3">
        <h1 class="text-4xl font-bold tracking-tight">
          {{ t('welcome.title') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('welcome.subtitle') }}
        </p>
        <p class="text-sm text-muted-foreground/70 max-w-md mx-auto">
          {{ t('welcome.description') }}
        </p>
        <div class="flex gap-3 justify-center mt-2">
          <Button @click="router.push({ name: ROUTES.USERS })">
            {{ t('welcome.goToUsers') }}
            <ArrowRight :size="14" class="ml-1.5" />
          </Button>
          <Button variant="outline" @click="router.push({ name: ROUTES.FAQ })">
            {{ t('welcome.goToFaq') }}
          </Button>
        </div>
      </div>

      <!-- Features grid -->
      <div>
        <h2 class="text-xl font-semibold mb-5 text-center">{{ t('welcome.features.title') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            v-for="feature in features"
            :key="feature.titleKey"
            class="hover:border-primary/40 transition-colors"
          >
            <CardHeader class="pb-2">
              <CardTitle class="flex items-center gap-2 text-base">
                <component :is="feature.icon" :size="18" :class="feature.color" />
                {{ t(feature.titleKey) }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">{{ t(feature.descKey) }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserStatusBadge } from '@/entities/user'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useGetUser } from '@/shared/api/hooks'
import { ROUTES } from '@/shared/config/routes'
import { BalanceCardWidget } from '@/widgets/balance-card'
import { TransactionsTableWidget } from '@/widgets/transactions-table'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const userId = computed(() => route.params.id as string)

const { data, isLoading } = useGetUser(userId)

const user = computed(() => data.value?.user)
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Back to users"
          class="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring"
          @click="router.push({ name: ROUTES.USERS })"
        >
          <ArrowLeft :size="16" :stroke-width="1.5" />
        </Button>

        <div class="flex flex-col gap-1 flex-1">
          <template v-if="isLoading">
            <Skeleton class="h-7 w-48" />
            <Skeleton class="h-4 w-32" />
          </template>
          <template v-else-if="user">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl font-semibold">{{ user.name }}</h1>
              <UserStatusBadge :user="user" />
            </div>
            <p class="text-sm text-muted-foreground">
              Overdraft Limit:
              <span class="tabular-nums font-medium text-foreground">{{ user.overdraftLimit }}</span>
            </p>
          </template>
        </div>
      </div>

      <BalanceCardWidget :user-id="userId" />

      <div class="flex flex-col gap-3">
        <h2 class="text-lg font-semibold">{{ t('transactions.title') }}</h2>
        <TransactionsTableWidget :user-id="userId" />
      </div>
    </div>
  </DefaultLayout>
</template>

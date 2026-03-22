<script setup lang="ts">
import { Lock, TrendingDown, TrendingUp, Unlock } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BalanceDisplay } from '@/entities/balance'
import { BalanceCreditDialog } from '@/features/balance-credit'
import { BalanceDebitDialog } from '@/features/balance-debit'
import { BalanceFreezeDialog } from '@/features/balance-freeze'
import { BalanceUnfreezeDialog } from '@/features/balance-unfreeze'
import { useGetBalance } from '@/shared/api/hooks'

interface Props {
  userId: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const userIdRef = computed(() => props.userId)
const { data, isLoading } = useGetBalance(userIdRef)

const creditOpen = ref(false)
const debitOpen = ref(false)
const freezeOpen = ref(false)
const unfreezeOpen = ref(false)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base font-semibold">{{ t('balance.title') }}</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-6">
      <template v-if="isLoading">
        <div class="grid grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="flex flex-col gap-2">
            <Skeleton class="h-3 w-16" />
            <Skeleton class="h-6 w-24" />
          </div>
        </div>
      </template>
      <BalanceDisplay v-else-if="data" :balance="data" />

      <div class="flex flex-wrap gap-2">
        <Button
          size="sm"
          class="gap-1.5 focus-visible:ring-2 focus-visible:ring-ring"
          :disabled="isLoading"
          @click="creditOpen = true"
        >
          <TrendingUp :size="14" :stroke-width="1.5" />
          Credit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          class="gap-1.5 focus-visible:ring-2 focus-visible:ring-ring"
          :disabled="isLoading"
          @click="debitOpen = true"
        >
          <TrendingDown :size="14" :stroke-width="1.5" />
          Debit
        </Button>
        <Button
          size="sm"
          variant="outline"
          class="gap-1.5 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-ring"
          :disabled="isLoading"
          @click="freezeOpen = true"
        >
          <Lock :size="14" :stroke-width="1.5" />
          Freeze
        </Button>
        <Button
          size="sm"
          variant="outline"
          class="gap-1.5 focus-visible:ring-2 focus-visible:ring-ring"
          :disabled="isLoading"
          @click="unfreezeOpen = true"
        >
          <Unlock :size="14" :stroke-width="1.5" />
          Unfreeze
        </Button>
      </div>
    </CardContent>
  </Card>

  <BalanceCreditDialog :open="creditOpen" :user-id="userId" @update:open="creditOpen = $event" />
  <BalanceDebitDialog :open="debitOpen" :user-id="userId" @update:open="debitOpen = $event" />
  <BalanceFreezeDialog :open="freezeOpen" :user-id="userId" @update:open="freezeOpen = $event" />
  <BalanceUnfreezeDialog :open="unfreezeOpen" :user-id="userId" @update:open="unfreezeOpen = $event" />
</template>

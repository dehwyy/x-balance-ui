<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Balance } from '../model/types'

interface Props {
  balance: Balance
}

const props = defineProps<Props>()
const { t } = useI18n()

const availableColor = computed(() => {
  const val = parseFloat(props.balance.available)
  if (val < 0) return 'text-red-500'
  return 'text-green-500'
})
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="flex flex-col gap-1">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t('balance.available') }}</span>
      <span :class="['text-lg font-semibold tabular-nums', availableColor]">
        {{ balance.available }}
      </span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t('balance.frozen') }}</span>
      <span class="text-lg font-semibold tabular-nums text-amber-500">
        {{ balance.frozen }}
      </span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">{{ t('balance.total') }}</span>
      <span class="text-lg font-semibold tabular-nums text-foreground">
        {{ balance.total }}
      </span>
    </div>
  </div>
</template>

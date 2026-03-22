<script setup lang="ts">
import type { TransactionType } from '../model/types'
import { TX_TYPE_COLORS, TX_TYPE_LABELS } from '../model/types'

interface Props {
  type: TransactionType
}

const props = defineProps<Props>()
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', TX_TYPE_COLORS[props.type]]"
  >
    {{ TX_TYPE_LABELS[props.type] }}
  </span>
</template>

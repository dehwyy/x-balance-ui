<script setup lang="ts">
import { AccordionItem as RekaAccordionItem } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ value: string; class?: HTMLAttributes['class'] }>()
</script>
<template>
  <RekaAccordionItem :value="props.value" :class="cn('border-b border-border/40', props.class)">
    <slot />
  </RekaAccordionItem>
</template>
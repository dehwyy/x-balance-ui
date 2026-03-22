<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { AccordionHeader, AccordionTrigger as RekaAccordionTrigger } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>
<template>
  <AccordionHeader class="flex">
    <RekaAccordionTrigger
      :class="cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium text-left cursor-pointer',
        'hover:text-primary transition-colors duration-200',
        '[&[data-state=open]>svg]:rotate-180',
        props.class
      )"
    >
      <slot />
      <ChevronDown :size="16" class="shrink-0 transition-transform duration-200 text-muted-foreground" />
    </RekaAccordionTrigger>
  </AccordionHeader>
</template>
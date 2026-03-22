<script setup lang="ts">
import { AccordionContent as RekaAccordionContent } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>
<template>
  <RekaAccordionContent
    :class="cn(
      'overflow-hidden text-sm',
      'data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
      props.class
    )"
  >
    <div class="pb-4 pt-0 text-muted-foreground leading-relaxed">
      <slot />
    </div>
  </RekaAccordionContent>
</template>